import { computed, Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ApiActivityService {
  private nextId = 0;
  private readonly requests = signal<Array<{ id: number; message: string }>>(
    [],
  );
  readonly active = computed(() => this.requests().length > 0);
  readonly message = computed(
    () => this.requests().at(-1)?.message ?? "Loading...",
  );

  begin(message: string): number {
    const id = ++this.nextId;
    this.requests.update((requests) => [...requests, { id, message }]);
    return id;
  }

  end(id: number): void {
    this.requests.update((requests) =>
      requests.filter((request) => request.id !== id),
    );
  }
}
