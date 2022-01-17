import { observable } from 'mobx';

class MenuStore {
  @observable showMenu: boolean = false;
  @observable option: string = "1Crawl";
  @observable pageCrawl: any = {};

  @observable changePageCrawl = (keyValue: string, newValue: string) => {
    this.pageCrawl = {
      ...this.pageCrawl,
      [keyValue]: newValue
    }
  }
  changeOption = (str: string) => {
    this.option = str;
  }
  changeShowMenu = () => {
    this.showMenu = !this.showMenu;
  }
}

export const menuStore = new MenuStore();