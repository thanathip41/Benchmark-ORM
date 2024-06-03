import autocannon , { Result } from 'autocannon'

import yargs from 'yargs';

const { argv } : Record<string,any> = yargs(process.argv.slice(2))
let limit = argv.l || argv.limit
let duration = argv.d || argv.duration
let repeat = argv.r || argv.repeat
let wait = argv.w || argv.wait

limit    = limit == null ? 100 : Number(limit)
duration = duration == null ? 10 : Number(duration)
repeat   = repeat == null ? 1 : Number(repeat)
wait     = wait == null ? 0 : Number(wait)

const query = `limit=${limit}`

const url = (path : string) => `http://localhost:3000/${path}?${query}`

const urls = [
    { name: 'mysql2',       url: url('mysql2')},
    { name: 'sequelize',    url: url('sequelize')},
    { name: 'typeorm',      url: url('typeorm')},
    { name: 'prisma',       url: url('prisma')},
    { name: 'tspace-mysql', url: url('tspace-mysql')},
    { name: 'drizzle',      url: url('drizzle-orm')},
  ];

const sleep = (ms : number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const runBenchmark = async () : Promise<{
    name      : string
    url       : string 
    send      : number 
    execution : number
    duration  : number
    limit     : number
}[]> => {

    const results = [];
  
    for (const { name, url } of urls) {

        const result : Result  = await new Promise((resolve, reject) => {
            autocannon({
                url,
                connections: 1,
                duration,
            }, (err, result) => {

                if (err) return reject(err);

                return resolve(result);

            });
        })

        results.push({ 
            name, 
            url, 
            send : result.requests.total, 
            execution: result.latency.average,
            duration : duration,
            limit,
        });

        if (name !== urls[urls.length - 1].name) {
            await sleep(1000 * wait)
        }
    }

    return results
}

const benchmark = async () => {
    console.log(`
    Benchmark ORM(s) analysis for performance
    
        library  : ${urls.length} lib(s) 
        ${urls.map(v => `\n\t - ${v.name}`).join('')}
        
        duration   : ${duration} lib /seconds
        wait       : ${wait} lib /seconds
        limit      : ${limit} limit
        repeat     : ${repeat} repeat   

        finished   : +-${((duration + wait) * repeat * urls.length) / 2} seconds
    `)

    const promises = [];
    
    for(let i = 1; i <= repeat; i++) {
        promises.push(() => runBenchmark())
    }

    const startTime = +new Date()
    const results  = await Promise.all(promises.map(v => v()))
    
    const grouping = results.flat().reduce((acc, curr) => {

        if (!acc[curr.name]) {
            acc[curr.name] = {
                name: curr.name,
                totalAvg : [],
                totalSend : [],
                avg: 0,
                send: 0
            }
        }

       
        acc[curr.name].avg += curr['execution']
        acc[curr.name].send += curr['send']
        acc[curr.name].totalAvg.push(curr['execution'])
        acc[curr.name].totalSend.push(curr['send'])

        return acc
    }, {} as Record<string , any>)

    const result = Object.values(grouping).map((data) => {
        const v = data as unknown as  { 
            name      : string 
            avg       : number
            send      : number 
            totalAvg  : number[]
            totalSend : number[] 
        }

        return {
            'library' : v.name,
            'totalRequest' : v.totalSend.map(v => Number(v)),
            'totalExecute' : v.totalAvg.map(v => Number(v)),
            'avgRequest': Number((v.send / repeat).toFixed(2)),
            'avgExecute': Number((v.avg / repeat).toFixed(2)),
        }
    });

    const theWinner = result.reduce((min, entry) => {
        if (
            entry['avgExecute'] > 0 && 
            (entry['avgExecute'] < min['avgExecute'] || 
            min['avgExecute'] === 0)
        ) {
            return entry
        }
        return min
    }, result[0])

    const endTime = +new Date()

    console.table(result);

    console.log(`
        The winner is "${theWinner.library}" 

        limit     : ${limit} rows 
        duration  : ${duration} seconds 
        request   : ${theWinner['avgRequest']} requests
        execute   : ${theWinner['avgExecute']} request/ms
       
        benchmark : ${(endTime - startTime) / 1000} seconds
    `)

}

benchmark()