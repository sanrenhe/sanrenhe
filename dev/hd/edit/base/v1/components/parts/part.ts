import Vue from "vue";
import { Getter } from "vuex-class";
import { Dictionary } from "vuex";

class Part extends Vue {
    @Getter public info!: Dictionary<any>;
    @Getter public apiList!: Dictionary<any>;
    @Getter public editEleBlackList!: string[];
    popover: object;
    constructor(popover: object) {
        super();
        this.popover = popover;
    }
}

export default Part;
