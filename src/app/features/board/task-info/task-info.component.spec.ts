import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TaskInfoComponent } from "./task-info.component";

describe("TaskInfoComponent", () => {
  let component: TaskInfoComponent;
  let fixture: ComponentFixture<TaskInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskInfoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
