export class Registry {
    constructor(private listener: any) { }

    pause() { this.listener({ pause: true }); }
    resume() { this.listener({ pause: false }); }
}