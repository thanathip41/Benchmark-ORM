import autocannon, { Result } from 'autocannon'
import yargs from 'yargs'

const { argv }: Record<string, any> = yargs(process.argv.slice(2))
let limit = argv.l || argv.limit
let duration = argv.d || argv.duration
let repeat = argv.r || argv.repeat

limit    = limit == null ? 10_000 : Number(limit)
duration = duration == null ? 10 : Number(duration)
repeat   = repeat == null ? 1 : Number(repeat)

const query = `limit=${limit}`
const url = (path: string) => `http://localhost:3000/${path}?${query}`

const urls = [
    { name: 'mysql2',       url: url('mysql2') },
    { name: 'sequelize',    url: url('sequelize') },
    { name: 'tspace-mysql', url: url('tspace-mysql') },
    { name: 'prisma',       url: url('prisma') },
    { name: 'typeorm',      url: url('typeorm') },
    { name: 'drizzle-orm',  url: url('drizzle-orm') },
]

const runBenchmark = async (): Promise<{
  name: string
  url: string
  send: number
  execution: number
  duration: number
  limit: number
  success: number
  error: number
}[]> => {
  return await Promise.all(
    urls.map(({ name, url }) =>
      new Promise<{
        name: string
        url: string
        send: number
        execution: number
        duration: number
        limit: number
        success: number
        error: number
      }>((resolve, reject) => {
        let successCount = 0
        let errorCount = 0

        autocannon({
          url,
          connections: 1,
          duration,
          setupClient: (client) => {
            client.on('response', (statusCode) => {
              if (statusCode >= 200 && statusCode < 300) {
                successCount++
              } else {
                errorCount++
              }
            })
          }
        }, (err, result) => {
          if (err) return reject(err)

          resolve({
            name,
            url,
            send: result.requests.total,
            execution: result.latency.average,
            duration,
            limit,
            success: successCount,
            error: errorCount,
          })
        })
      })
    )
  )
}


const benchmark = async () => {
    console.log(`
    Benchmark ORM(s) analysis for performance
    
        library    : ${urls.length} lib(s)
        ${urls.map(v => `\n\t - ${v.name}`).join('')}
        
        duration   : ${duration} seconds/lib
        limit      : ${limit} rows
        repeat     : ${repeat} repeat(s)

        estimated  : ~${(duration * repeat)} seconds total
    `)

    const startTime = Date.now()

    const resultsMatrix = await Promise.all(
        Array.from({ length: repeat }, () => runBenchmark())
    )

    const combined = resultsMatrix.flat()

    const grouped = combined.reduce((acc, curr) => {
        if (!acc[curr.name]) {
            acc[curr.name] = {
                name: curr.name,
                url: curr.url,
                totalAvg: [],
                totalSend: [],
                avg: 0,
                send: 0,
                success: 0,
                error: 0,
            }
        }
        acc[curr.name].avg += curr.execution
        acc[curr.name].send += curr.send
        acc[curr.name].totalAvg.push(curr.execution)
        acc[curr.name].totalSend.push(curr.send)
        acc[curr.name].success += curr.success
        acc[curr.name].error += curr.error
        return acc
    }, {} as Record<string, any>)

    const result = Object.values(grouped).map((v: any) => ({
        library: v.name,
        url: v.url,
        totalRequest: v.totalSend,
        totalExecute: v.totalAvg,
        avgRequest: Number((v.send / repeat).toFixed(2)),
        avgExecute: Number((v.avg / repeat).toFixed(2)),
        totalSuccess: v.success,
        totalError: v.error,
    }))

    const theWinner = result.reduce((best, entry) => {
      if (entry.totalSuccess > best.totalSuccess) {
          return entry
      }

      if (
          entry.totalSuccess === best.totalSuccess &&
          entry.avgExecute < best.avgExecute
      ) {
          return entry
      }

      return best
    }, result[0])

    const endTime = Date.now()

    console.table(result)

    console.log(`
    🏆 The winner is "${theWinner.library}" 

        limit     : ${limit} rows 
        duration  : ${duration} seconds
        repeat    : ${repeat} 
        request   : ${theWinner.avgRequest} requests
        execute   : ${theWinner.avgExecute} ms/request
        success   : ${theWinner.totalSuccess} responses
        error     : ${theWinner.totalError} errors
       
        benchmark : ${(endTime - startTime) / 1000} seconds
    `)
}

benchmark()
