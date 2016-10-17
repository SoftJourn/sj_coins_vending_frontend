export class AddMenu {
  iconState: boolean = false;
  visible: boolean = false;

  public spinPlusIcon() {
    this.iconState = !this.iconState;
  }

  public changeVisibility(visibility: boolean) {
    this.visible = visibility;
  }
  public getMenuButtonName():string{
    return this.visible?"Cancel":"Add";
  }
}
