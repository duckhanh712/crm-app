import { observable } from 'mobx';

class CrawlingStore {
  @observable itemsMap: number[] = [1];
  @observable items: number = 1;
  @observable shops: any = {};
  @observable data: any = [];
  @observable activeModal: boolean= false;
  @observable activeModalFile: boolean= false;
  @observable valid: boolean = true;
  @observable loading: boolean = false;
  validBtnSave = () => {
    if(Object.keys(this.shops).length < 1){
      this.valid = true;
    }else {
      this.valid = false;
    }
  }
  
  deletePropShops = async (index: number) => {
    let indexStr = index.toString().trim();
    if(this.itemsMap.length > 1){
      this.itemsMap = await this.itemsMap.filter((item) => item !== index );
    }
    // this.in = index.toString();
    await delete this.shops[indexStr];
    // await delete this.shops[this.in];
    this.validBtnSave();
  }

  updateShops = (keyValue: string, newValue: string) => {
    if(newValue === ""){
      delete this.shops[keyValue];
    }else {
      this.shops = {
        ...this.shops,
        [keyValue]: newValue
      }
    }
    this.validBtnSave();
  }
  cancel = () => {
    this.itemsMap = [1];
    this.items = 1;
    this.shops = {};
    this.data = [];
    this.validBtnSave();
  }
  dataToSend = () => {
    let arrayData: string[] = [];
    for (const shop in this.shops) {
      arrayData.push(this.shops[shop]);
    };
    this.data = arrayData;
  }
}

export const crawlingStore = new CrawlingStore();