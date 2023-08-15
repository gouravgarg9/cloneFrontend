import {io} from 'socket.io-client'

const URL=`${process.env.REACT_APP_BACK_END_ROOT}`

export const socket=io(URL);