import { Component, Inject, OnInit } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { Task } from '../task/task';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css'],
})
export class TaskDialogComponent implements OnInit {
  private backupTask: Partial<Task> = { ...this.data.task };
  user: any;

  constructor(private authService: AuthService, 
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {}

  ngOnInit(): void {
    const auth = getAuth();
  
    auth.onAuthStateChanged(
      (user) => {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }
      }
    );
  }
  
  cancel(): void {
    this.data.task.title = this.backupTask.title;
    this.data.task.description = this.backupTask.description;
    this.dialogRef.close(this.data);
  }
}




export interface TaskDialogData {
  task: Partial<Task>;
  enableDelete: boolean;
}

export interface TaskDialogResult {
  task: Task;
  delete?: boolean;
}
