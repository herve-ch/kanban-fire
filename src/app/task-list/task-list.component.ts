import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collectionData, collection, CollectionReference, query, runTransaction, doc, deleteDoc, addDoc } from '@angular/fire/firestore';
import { updateDoc } from 'firebase/firestore'; import { BehaviorSubject, Observable } from 'rxjs';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { Task } from '../task/task';

const getObservable = (collection: Observable<Task[]>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent{

  todo: Observable<Task[]>;
  inProgress: Observable<Task[]>;
  done: Observable<Task[]>;

  constructor(private dialog: MatDialog, private firestore: Firestore) {

    const todoRef = collection(firestore, 'todo');
    this.todo = getObservable(collectionData(todoRef, { idField: 'id' }) as Observable<Task[]>);

    const inProgressRef = collection(firestore, 'inProgress');
    this.inProgress = getObservable(collectionData(inProgressRef, { idField: 'id' }) as Observable<Task[]>);

    const doneRef = collection(firestore, 'done');
    this.done = getObservable(collectionData(doneRef, { idField: 'id' }) as Observable<Task[]>);
  }

  newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }

        if (result.task.description != undefined || result.task.title != undefined) {
          const addRef = collection(this.firestore, 'todo');
          addDoc(addRef, result.task)
        }
      });
  }


  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      const docRef = doc(this.firestore, list + `/${task.id}`);

      if (!result) {
        return;
      }
      if (result.delete) {
        deleteDoc(docRef);
      } else {

        updateDoc(docRef, { 'description': task.description, 'title': task.title });
      }
    });

  }

  drop(event: CdkDragDrop<Task[] | null>): void {
    if (event.previousContainer === event.container) {
      return;
    }

    if (event.previousContainer.data && event.container.data) {
      const item = event.previousContainer.data[event.previousIndex];

      runTransaction(this.firestore, () => {
        const deleteRef = doc(this.firestore, event.previousContainer.id + `/${item.id}`);
        const addRef = collection(this.firestore, event.container.id);

        const promise = Promise.all([
          deleteDoc(deleteRef),
          addDoc(addRef, item),
        ]);
        return promise;
      })

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

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


