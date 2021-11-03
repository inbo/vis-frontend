import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PicturesService} from '../../../../services/vis.pictures.service';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html'
})
export class UploadFilesComponent implements OnInit {
  @Input() projectCode: string;
  @Input() surveyEventId: number;

  files: FilePreview[] = [];
  progressInfos: any[] = [];

  constructor(private picturesService: PicturesService, private changeDetection: ChangeDetectorRef,
              private sanitizer: DomSanitizer) {
  }

  addFile(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      const isImage = file.type.match('image.*');
      if (isImage) {
        this.files.push(new FilePreview(file, this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))));
      }
    }
    this.changeDetection.detectChanges();

  }


  ngOnInit() {
  }

  fileSize(file: File) {
    return file.size > 1024
      ? file.size > 1048576
        ? Math.round(file.size / 1048576) + 'mb'
        : Math.round(file.size / 1024) + 'kb'
      : file.size + 'b';
  }


  uploadAll() {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i].file;
      this.upload(i, file);
    }
  }

  upload(idx: number, file: File) {
    this.progressInfos[idx] = {value: 0, fileName: file.name};

    if (file) {
      this.picturesService.upload(file, this.projectCode, this.surveyEventId).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
          }
        },
        (err: any) => {
          this.progressInfos[idx].value = 0;
        });
    }
  }

  remove(index: number) {
    this.files.splice(index, 1);
  }

  onChange($event: Event) {
    this.addFile(($event.target as HTMLInputElement).files);
  }

  reset() {
    this.files = [];
    this.progressInfos = [];
  }
}

export class FilePreview {
  private _file: File;
  private _url: SafeUrl;


  constructor(file: File, url: SafeUrl) {
    this._file = file;
    this._url = url;
  }

  get file(): File {
    return this._file;
  }

  get url(): SafeUrl {
    return this._url;
  }
}
