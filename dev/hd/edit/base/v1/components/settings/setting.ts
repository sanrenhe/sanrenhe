import Vue from "vue";
import { Getter, Mutation } from "vuex-class";
import { Dictionary } from "vuex";

class Setting extends Vue {
    @Getter public info!: Dictionary<any>;
    @Getter public editEleBlackList!: string[];
    @Getter public apiList!: Dictionary<any>;
    @Getter public activeNames!: Dictionary<any>;
    @Getter public activeEdit!: Dictionary<any>;

    popover: object;
    constructor(popover: object) {
        super();
        this.popover = popover;
    }
}

export default Setting;
