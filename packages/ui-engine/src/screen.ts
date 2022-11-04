export class Screen {
    constructor(private name: string) { }

    public handleKeys(key: string): void { }
    public render(): void { }

    get screenName(): string {
        return this.name;
    }
}