import { PlatformModule } from '@angular/cdk/platform';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';

import { SidenavComponent, SidenavContainerComponent, SidenavContentComponent } from './sidenav.component';

@NgModule({
  declarations: [
    SidenavComponent,
    SidenavContainerComponent,
    SidenavContentComponent,
  ],
  imports: [
    CommonModule,
    MatCommonModule,
    ScrollingModule,
    PlatformModule,
  ],
  exports: [
    MatCommonModule,
    SidenavComponent,
    SidenavContainerComponent,
    SidenavContentComponent,
  ]
})
export class SidenavModule { }
