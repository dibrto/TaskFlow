import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditBoardComponent } from "./edit-board.component";

describe("EditBoardComponent", () => {
  let component: EditBoardComponent;
  let fixture: ComponentFixture<EditBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBoardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
