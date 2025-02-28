import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Task } from '@take-home/shared';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'take-home-filters-component',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  standalone: false,
})
export class FiltersComponent {
  constructor(protected tasksService: TasksService) {}

  filters: { key: keyof Task; label: string }[] = [
    { key: 'priority', label: 'High Priority' },
    { key: 'completed', label: 'Not Complete' },
    { key: 'scheduledDate', label: 'Due Today' },
  ];

  async filterTask(field: keyof Task, event: MatChipSelectionChange) {
    if (event.selected) {
      this.tasksService.setFilterValue(field);
    } else {
      this.tasksService.setFilterValue('');
    }
    await this.tasksService.updateTasks();
  }
}
