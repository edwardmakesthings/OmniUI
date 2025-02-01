import { ContentConfig } from "./ContentConfig";
import { LayoutConfig } from "./LayoutConfig";
import { StyleConfig } from "./StyleConfig";

/**
 * Complete component configuration
 */
export interface ComponentConfig {
    content?: ContentConfig;
    layout?: LayoutConfig;
    style?: StyleConfig;
  }