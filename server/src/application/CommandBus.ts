export class CommandBus {
  private readonly handlers = new Map<Function, { handle(command: unknown): void }>()

  register<T>(commandType: new (...args: never[]) => T, handler: { handle(command: T): void }): void {
    this.handlers.set(commandType, handler as { handle(command: unknown): void })
  }

  execute<T>(command: T): void {
    const handler = this.handlers.get((command as object).constructor)
    if (!handler) throw new Error(`No handler registered for ${(command as object).constructor.name}`)
    handler.handle(command)
  }
}
