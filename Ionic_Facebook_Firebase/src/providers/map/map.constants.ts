/**
 * @author    Damien Dell'Amico <damien.dellamico@gmail.com>
 * @copyright Copyright (c) 2016
 * @license   GPL-3.0
 */

export class MapConst {
  public static get DEFAULT_LAT(): number {
    return -12.046374;
  }

  public static get DEFAULT_LNG(): number {
    return -77.042793;
  }

  public static get DEFAULT_ZOOM(): number {
    //return 0.9;
    return 5;
  }

  public static get MAX_ZOOM(): number {
    return 18;
  }
}
