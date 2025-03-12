type EndpointStatus = "empty" | "error" | "default";

class EndpointStatusManager {
  private status: EndpointStatus = "default";

  getStatus(): EndpointStatus {
    return this.status;
  }

  setStatus(value: EndpointStatus): void {
    this.status = value;
  }
}

export const endpointStatusManager = new EndpointStatusManager();
