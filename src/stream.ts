import { Response } from "./response";

export default class AvandaStream {
    private onOpenedFunc: () => void;
    private onClosedFunc: () => void;
    private manualClosed: boolean;
    private retryDelayTime: number = 3000;
    private socket: WebSocket

    constructor(
        public url: string,
        // public controller
    ) {

    }

    listen(onData: (data: Response) => void) {
        this.socket = new WebSocket(this.url)
        this.socket.addEventListener('message', (event) => {
            onData(new Response(JSON.parse(event.data)))
        });

        this.socket.addEventListener('open', (event) => {
            if(typeof this.onOpenedFunc == 'function'){
                this.onOpenedFunc();
            }
        });

        this.socket.addEventListener('close', async (event) => {
            if(this.manualClosed) return;

            await new Promise((resolve) => setTimeout(resolve,this.retryDelayTime))
            
            this.listen(onData)
        });
    }

    close(code?: number) {
        this.manualClosed = true;
        this.socket.close(code)
        if(typeof this.onClosedFunc == 'function'){
            this.onClosedFunc();
        }
        return this;
    }

    async onError(onError: () => void) {
        return this;
    }

    onOpened(onOpened: () => void) {
        if (onOpened != null) {
          this.onOpenedFunc = onOpened;
        }
        return this;
      }

    onClosed(onClosed: () => void) {
        if (onClosed != null) {
          this.onClosedFunc = onClosed; 
        }
        return this;
      }
}
