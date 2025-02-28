import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskPriority } from '@take-home/shared';
import { StorageService } from '../storage/storage.service';
import * as dayjs from 'dayjs';
import Fuse from 'fuse.js';

@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks: Task[] = [];
  search: string = '';
  filterValue: string = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  setFilterValue(value: string): void {
    this.filterValue = value;
  }

  setSearchValue(value: string): void {
    this.search = value;
  }

  getTasksFromApi(): Observable<Task[]> {
    const endpointUrl = '/api/tasks';
    return this.http.get<Task[]>(endpointUrl);
  }

  async getTasksFromStorage(): Promise<void> {
    const tasks = await this.storageService.getTasks();
    this.tasks = this.filterTask('isArchived', tasks);
  }

  filterTask(key: string, tasks: Task[]): Task[] {
    switch (key) {
      case 'isArchived':
        return tasks.filter((task) => !task.isArchived);
      case 'priority':
        return tasks.filter((task) => task.priority === TaskPriority.HIGH);
      case 'scheduledDate':
        return tasks.filter((task) =>
          dayjs(task.scheduledDate).isSame(dayjs(), 'day'),
        );
      case 'completed':
        return tasks.filter((task) => !task.completed);
      default:
        return this.tasks;
    }
  }

  async updateTasks(): Promise<void> {
    if (!this.search) {
      await this.getTasksFromStorage();
      this.tasks = this.filterTask(this.filterValue, this.tasks);
      return;
    }

    await this.getTasksFromStorage();
    const fuse = new Fuse(this.tasks, {
      keys: ['title'],
      threshold: 0.5,
    });

    const fusedTasks = fuse.search(this.search).map((result) => result.item);

    this.tasks = this.filterValue
      ? this.filterTask(this.filterValue, fusedTasks)
      : fusedTasks;
  }
}
