import {SubscriptionClient} from "../protocol/SubscriptionClient";
import {Navigation} from "../Navigation";
import {WindowController} from "../WindowController";

export class RootClassPickerController {
    private navigation: Navigation;
    private client: SubscriptionClient;
    private form: W2UI.W2Form;
    private windowCtrl: WindowController;

    constructor(client: SubscriptionClient, navigation: Navigation, windowCtrl: WindowController) {
        this.client = client;
        this.navigation = navigation;
        this.windowCtrl = windowCtrl;
    }

    /**
     * Called when the component is mounted
     */
    async didMount() {
        if(this.form != null) {
            w2ui["rcPicker"].render($('#rcPicker')[0]);
            return;
        }

        let self = this;
        let model : Array<string> = await this.client.getClassInfo();

        this.form = $('#rcPicker').w2form({
            name: "rcPicker",
            header: 'Choose root class',
            fields: [
                { name: 'field_list', type: 'list', required: true,
                    options: { items: model } }
            ],
            actions: {
                reset: function () {
                    this.clear();
                },
                save: async function () {
                    var className = this.record["field_list"].text;
                    var result = await self.setRootClass(className, self);

                    if(result) {
                        this.clear();
                    }
                }
            }
        });
    }

    /**
     * Sets root class name
     * @param className
     * @param self
     * @returns {boolean}
     */
    private async setRootClass(className: string, self: RootClassPickerController) : Promise<boolean> {
        var response: string = await self.client.setRootClass(className);

        if(response === "OK") {
            self.windowCtrl.titleText = "TEMPO Plotting Tool [" + className + "]";
            self.navigation.openRunFunctionPickerView();

            return true;
        }
        return false;
    }
}