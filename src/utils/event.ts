// 引入 events 模块
var events = require('events');


class EventEmitter {
    static instance
    eventEmitter
    constructor() {
        
        // 创建 eventEmitter 对象
        this.eventEmitter = new events.EventEmitter();
    }

    static getInstance() {
        
        if(!EventEmitter.instance) {
        
            EventEmitter.instance = new EventEmitter().eventEmitter
        }
        return EventEmitter.instance
    }
}

export default EventEmitter.getInstance()