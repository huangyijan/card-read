import EventEmitter from "@/utils/event";

export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const eventName = 'message';
    console.log('sse方法被执行');
    

    let eventId = 0;
    EventEmitter.on('progress', (stream) => {
        const eventData = `data: ${stream.progress}\n\n`;
        res.write(`event: ${eventName}\n`);
        res.write(`id: ${eventId}\n`);
        res.write(`${eventData}`);
        eventId++;
    })

    //   if (eventId === 100) {
    //     clearInterval(intervalId);
    //     res.end();
    //   }
}