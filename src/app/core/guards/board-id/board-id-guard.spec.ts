import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { boardIdGuard } from "./board-id-guard";

describe("boardIdGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => boardIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
