export interface TandemvaultPicture {
  admin_rating: number;
  browse_url: string;
  catalogue_number: string;
  contributor: TandemvaultContributor;
  copyright: string;
  created_at: Date;
  curated_state: string;
  expired: boolean;
  file_size: number;
  filename: string;
  grid_url: string;
  height: number;
  id: number;
  margin_top: number;
  modified_at: Date;
  permalink_url: string;
  purchaseable: boolean;
  short_caption: string;
  state: string;
  thumb_url: string;
  to_s: string;
  type: string;
  upload_guid: string;
  version_number: number;
  width: number;
  captured_at: Date;
}

export interface TandemvaultPictureDetail {
  admin_rating: number;
  browse_url: string;
  catalogue_number: string;
  checked_out_at: Date;
  checked_out_by: string;
  contributor: TandemvaultContributor;
  copyright: string;
  created_at: Date;
  curated_state: string;
  expired: boolean;
  ext: string;
  file_size: number;
  filename: string;
  grid_url: string;
  height: number;
  id: number;
  margin_top: number;
  modified_at: string;
  permalink_url: string;
  purchaseable: boolean;
  short_caption: string;
  state: string;
  tag_list: string[];
  thumb_url: string;
  to_s: string;
  type: string;
  upload_guid: string;
  version_number: number;
  width: number;
  captured_at: Date;
}

export interface TandemvaultContributor {
  id: string;
  to_s: string;
  default_download_destination: string;
}

export interface TandemvaultDownloadResult {
  url: string;
}

export interface CollectionDetail {
  id: string;
  name: string;
  slug: string;
  name_with_hierarchy: string;
  all_assets_count: string;
}
