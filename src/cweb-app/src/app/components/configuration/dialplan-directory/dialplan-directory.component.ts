import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Iitem, Ilcr, IsimpleModule} from '../../../store/config/config.state.struct';
import {select, Store} from '@ngrx/store';
import {AppState, selectConfigurationState} from '../../../store/app.states';
import {AbstractControl} from '@angular/forms';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute} from '@angular/router';
import {
  DelDialplanDirectoryParameter,
  AddDialplanDirectoryParameter,
  StoreNewDialplanDirectoryParameter,
  StoreDropNewDialplanDirectoryParameter,
  SwitchDialplanDirectoryParameter,
  UpdateDialplanDirectoryParameter
} from '../../../store/config/dialplan_directory/config.actions.dialplan_directory';

@Component({
  selector: 'app-dialplan-directory',
  templateUrl: './dialplan-directory.component.html',
  styleUrls: ['./dialplan-directory.component.css']
})
export class DialplanDirectoryComponent implements OnInit, OnDestroy {

  public configs: Observable<any>;
  public configs$: Subscription;
  public list: IsimpleModule;
  public selectedIndex: number;
  private lastErrorMessage: string;
  public loadCounter: number;
  public globalSettingsDispatchers: object;

  constructor(
    private store: Store<AppState>,
    private bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
  ) {
    this.selectedIndex = 0;
    this.configs = this.store.pipe(select(selectConfigurationState));
  }

  ngOnInit() {
    this.configs$ = this.configs.subscribe((configs) => {
      this.loadCounter = configs.loadCounter;
      this.list = configs.dialplan_directory;
      this.lastErrorMessage = configs.dialplan_directory && configs.dialplan_directory.errorMessage || null;
      if (!this.lastErrorMessage) {
      } else {
        this._snackBar.open('Error: ' + this.lastErrorMessage + '!', null, {
          duration: 3000,
          panelClass: ['error-snack'],
        });
      }
    });
    this.globalSettingsDispatchers = {
      addNewItemField: this.addNewDialplanDirectoryParam.bind(this),
      switchItem: this.switchDialplanDirectoryParam.bind(this),
      addItem: this.newDialplanDirectoryParam.bind(this),
      dropNewItem: this.dropNewDialplanDirectoryParam.bind(this),
      deleteItem: this.deleteDialplanDirectoryParam.bind(this),
      updateItem: this.updateDialplanDirectoryParam.bind(this),
      pasteItems: null,
    };
  }

  ngOnDestroy() {
    this.configs$.unsubscribe();
    if (this.route.snapshot?.data?.reconnectUpdater) {
       this.route.snapshot.data.reconnectUpdater.unsubscribe();
     }
  }

  updateDialplanDirectoryParam(param: Iitem) {
    this.store.dispatch(new UpdateDialplanDirectoryParameter({param: param}));
  }

  switchDialplanDirectoryParam(param: Iitem) {
    const newParam = <Iitem>{...param};
    newParam.enabled = !newParam.enabled;
    this.store.dispatch(new SwitchDialplanDirectoryParameter({param: newParam}));
  }

  newDialplanDirectoryParam(index: number, name: string, value: string) {
    const param = <Iitem>{};
    param.enabled = true;
    param.name = name;
    param.value = value;

    this.store.dispatch(new AddDialplanDirectoryParameter({index: index, param: param}));
  }

  deleteDialplanDirectoryParam(param: Iitem) {
    this.store.dispatch(new DelDialplanDirectoryParameter({param: param}));
  }

  addNewDialplanDirectoryParam() {
    this.store.dispatch(new StoreNewDialplanDirectoryParameter(null));
  }

  dropNewDialplanDirectoryParam(index: number) {
    this.store.dispatch(new StoreDropNewDialplanDirectoryParameter({index: index}));
  }

  checkDirty(condition: AbstractControl): boolean {
    if (condition) {
      return !condition.dirty;
    } else {
      return true;
    }
  }

  isReadyToSendThree(mainObject: AbstractControl, object2: AbstractControl, object3: AbstractControl): boolean {
    return (mainObject && mainObject.valid && mainObject.dirty)
      || ((object2 && object2.valid && object2.dirty) || (object3 && object3.valid && object3.dirty));
  }

  isvalueReadyToSend(valueObject: AbstractControl): boolean {
    return valueObject && valueObject.dirty && valueObject.valid;
  }

  isReadyToSend(nameObject: AbstractControl, valueObject: AbstractControl): boolean {
    return nameObject && valueObject && (nameObject.dirty || valueObject.dirty) && nameObject.valid && valueObject.valid;
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  isNewReadyToSend(nameObject: AbstractControl, valueObject: AbstractControl): boolean {
    return nameObject && valueObject && nameObject.valid && valueObject.valid;
  }

}

