export default class myShopDetailParam extends URLSearchParams {
    constructor(search: String | null){
      super(search + "");
      Object.setPrototypeOf(this, myShopDetailParam.prototype)
    }
  
    get getId(): string{
      let id: any = this.get('id') || null;
      if(id === undefined || id == null){
        id = "all";
      }
      return id;
    }
  
  }