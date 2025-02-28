import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TaskPriority } from '@take-home/shared';
import { StorageService } from '../../storage/storage.service';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'take-home-add-component',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  standalone: false,
})
export class AddComponent {
  protected addTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    description: new FormControl(null),
    priority: new FormControl(
      { value: TaskPriority.MEDIUM, disabled: false },
      {
        validators: Validators.required,
      },
    ),
    scheduledDate: new FormControl(null),
  });
  protected priorities = Object.values(TaskPriority);

  constructor(private storageService: StorageService, private router: Router) {}

  onSubmit() {
    const newTask: Task = {
      ...this.addTaskForm.getRawValue(),
      uuid: faker.string.uuid(),
      isArchived: false,
    };

    this.storageService.addTaskItem(newTask);
    this.router.navigateByUrl('/');
  }

  onCancel(): void {
    this.router.navigateByUrl('/');
  }

  datePickerRestrictionFilter = (d: Date | null): boolean => {
    if (!d) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return (
      d >= today && d <= nextWeek // Within the next 7 days
    );
  };
}
