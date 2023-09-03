import EventEmitter from "@/utils/event";



export default function handler(req, res) {
  EventEmitter.emit('progress', { progress: 5 })
  res.status(200).json({ msg: '测试消息通知' });
}