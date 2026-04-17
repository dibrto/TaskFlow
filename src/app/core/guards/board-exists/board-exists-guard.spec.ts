import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";

import { boardExistsGuard } from "./board-exists-guard";

describe("boardExistsGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => boardExistsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
