<template>
    <div>
        <!-- 指标任务设置 -->
        <el-divider content-position="left">
            指标任务设置
        </el-divider>
        <!-- 指标任务 -->
        <el-row
            type="flex"
            class="edit-control_ele"
            v-if="eleFillter('activity.templet_set.is_indicator_on')"
        >
            <el-col :span="4">
                <p>
                    指标任务：
                </p>
            </el-col>
            <el-col :span="18">
                <el-switch
                    active-text="开启"
                    inactive-text="关闭"
                    active-value="1"
                    inactive-value="2"
                    @change="indicatorStatusChange"
                    v-model="info.activity.templet_set.is_indicator_on"
                >
                </el-switch>
                &nbsp;&nbsp;&nbsp;
                <el-button
                    :disabled="taskList.length > 7 || info.activity.status == 1 || indicatorTaskList.length == 0"
                    @click="addTask"
                    type="primary"
                    icon="el-icon-plus"
                    round
                    size="small"
                    v-if="info.activity.templet_set.is_indicator_on == '1'"
                >新增指标任务</el-button>
            </el-col>
        </el-row>
        <!-- 列表 -->
        <template v-if="info.activity.templet_set.is_indicator_on == '1'">
            <el-row
                type="flex"
                class="edit-control_ele"
                v-for="(task, index) in taskList"
                :key="task.id"
                v-loading="updateTask"
            >
                <template v-if="task.status != '2'">

                    <el-col :span="2">
                    </el-col>
                    <el-col :span="22">
                        <el-card
                            shadow="hover"
                            class="box-card"
                        >
                            <div
                                slot="header"
                                class="clearfix"
                                style="margin: -1rem 0;line-height: 30px;"
                            >
                                <!-- 指标任务 -->
                                <span>指标任务{{index+1}}<em style="font-size: 12px; color: #8F8F8F;"></em></span>
                                <!-- 指标任务删除按钮 -->
                                <el-popover
                                    placement="top"
                                    width="160"
                                    v-model="task.deleteVisible"
                                >
                                    <p style="text-align: center; margin-bottom: 0.5rem;">确定删除该指标任务吗？</p>
                                    <div style="text-align: center; margin: 0">
                                        <el-button
                                            size="mini"
                                            type="text"
                                            @click="task.deleteVisible = false"
                                        >取消</el-button>
                                        <el-button
                                            type="primary"
                                            size="mini"
                                            @click="deleteTask(task, index)"
                                        >确定</el-button>
                                    </div>
                                    <el-button
                                        size="mini"
                                        slot="reference"
                                        :disabled="info.activity.status == 1"
                                        type="danger"
                                        icon="el-icon-delete"
                                        circle
                                        style="float: right"
                                    ></el-button>
                                </el-popover>
                            </div>
                            <div>
                                <!-- 场次时间 -->
                                <el-row type="flex">
                                    <el-col :span="3">
                                        <p>指标任务：</p>
                                    </el-col>
                                    <el-col :span="21">
                                        <el-select
                                            v-model="task.indicator_id"
                                            placeholder="请选择任务"
                                            :disabled="info.activity.status == 1"
                                        >
                                            <el-option
                                                v-for="task in indicatorTaskList"
                                                :key="task.id"
                                                :label="task.name"
                                                :value="task.id"
                                                :disabled="task.disabled"
                                            >
                                            </el-option>
                                        </el-select>
                                    </el-col>
                                </el-row>
                                <!-- 场次时间 -->
                                <el-row type="flex">
                                    <el-col :span="3"></el-col>
                                    <el-col :span="21">
                                        <div>
                                            <h2 class="task-title">1.抽奖机会设置</h2>
                                            完成 1 次指标奖励抽奖机会：<el-input-number
                                                size="mini"
                                                controls-position="right"
                                                :min="0"
                                                :max="99"
                                                :precision="0"
                                                v-model="task.complete_one"
                                                :disabled="info.activity.status == 1"
                                                @blur="(e) => task.complete_one = filterElInputNumber(task.complete_one, 1)"
                                            ></el-input-number>
                                            次
                                        </div>
                                        <div>
                                            <h2 class="task-title">2.任务指标奖励次数限制
                                                <el-switch
                                                    active-value="1"
                                                    inactive-value="2"
                                                    v-model="task.limit_status"
                                                    :disabled="info.activity.status == 1"
                                                >
                                                </el-switch>
                                            </h2>
                                            <template v-if="task.limit_status == '1'">
                                                活动奖励任务总次数：<el-input-number
                                                    size="mini"
                                                    controls-position="right"
                                                    :min="0"
                                                    :max="99"
                                                    :precision="0"
                                                    v-model="task.number_limit"
                                                    :disabled="info.activity.status == 1"
                                                    @blur="(e) => task.number_limit = filterElInputNumber(task.number_limit, 1)"
                                                ></el-input-number>
                                                次
                                            </template>
                                        </div>
                                        <div>
                                            <h2 class="task-title">3.“做任务”按钮跳转链接</h2>
                                            <el-input
                                                placeholder="请输入跳转网址"
                                                size="medium"
                                                v-model="task.task_link"
                                            >
                                            </el-input>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-card>
                    </el-col>
                </template>
            </el-row>
        </template>
        <el-alert
            :title="noneInicatorTaskTip"
            type="info"
            center
            show-icon
            :closable="false"
            v-if="indicatorTaskList.length == 0 && noneInicatorTaskTip != ''"
        >
        </el-alert>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Inject, Prop, Watch } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class'
import Setting from './setting';
import { Dictionary } from 'vuex';
import { listenMessage, MessageData, MessageType } from '../../message';

@Component
export default class indicatorTaskSet extends Setting {
    constructor() {
        super({
            'warn': '活动开启后不可更改'
        })
    }
    @State('appData') appData!: Dictionary<any>
    @Mutation updateLoadShow!: Function
    @Mutation updateEditInfoStatus!: Function

    @Inject() onDataChange!: Function

    private indicatorTaskList: Dictionary<any> = [];
    private updateTask: boolean = false;
    private maxTaskId: number = 0;
    private taskList: Dictionary<any> = [];
    private noneInicatorTaskTip: string = '';

    private defaultTaskData = {
        "complete_one": 1,          // 完成1次指标奖励抽奖机会
        "id": "",                   // 任务id
        "indicator_id": "",         // 指标任务id
        "limit_status": "1",        // 任务指标奖励次数限制
        "number_limit": 1,          // 活动奖励任务总次数
        "task_link": "",            // 跳转链接
        "status": 1,              // 指标任务状态 1-正常、2-删除
    }

    created() {
        // 获取该活动下的指标任务
        if (this.info.activity.templet_set.is_indicator_on == '1') {
            this.getIndicatorTaskList();
        }
    }

    mounted() {
        this.taskList = this.appData.indicatorTask.list;
        // 监听指标任务列表
        this.$watch('taskList', () => { return this.taskListWatch() }, { deep: true })
    }

    /**
     * @description: 更新任务禁选状态
     * @param {type}
     */
    public updateTaskStatus() {
        this.indicatorTaskList.forEach((indicator: Dictionary<any>) => {
            indicator.disabled = false;
        });

        this.indicatorTaskList.forEach((indicator: Dictionary<any>) => {
            this.taskList.forEach((task: Dictionary<any>) => {
                if (indicator.id == task.indicator_id) {
                    indicator.disabled = true;
                }
            })
        });
    }

    /**
     * @description: 指标任务列表watch
     * @param {type}
     */
    public taskListWatch() {
        // 传递消息
        this.onDataChange(MessageType.update);
        // 更改编辑数据状态
        this.updateEditInfoStatus(1);
        // 更新任务禁选状态
        this.updateTaskStatus();
    }

    // 获取该活动下的指标任务
    public getIndicatorTaskList() {
        this.updateLoadShow(false);
        this.updateTask = true;
        this.$http.get(this.apiList.indicatorUrl).then((res: Dictionary<any>) => {
            if (res.status == 'success') {
                this.renderIndicatorList(res.data);
                this.noneInicatorTaskTip = '';
            } else {
                this.noneInicatorTaskTip = res.message;
                window.setTimeout(() => {
                    this.info.activity.templet_set.is_indicator_on = '2';
                }, 1000);
            }
            this.updateLoadShow(true);
            this.updateTask = false;
        });
    }

    // 处理指标任务列表数据
    public renderIndicatorList(list: any) {
        list.forEach((indicator: Dictionary<any>) => {
            indicator.disabled = false;
            this.taskList.forEach((task: Dictionary<any>) => {
                if (indicator.id == task.indicator_id) {
                    indicator.disabled = true;
                }
            });
        });
        this.indicatorTaskList = list;
        // 更新任务禁选状态
        this.updateTaskStatus();
    }

    /**
     * @description: 指标任务状态
     * @param {val: string}
     */
    public indicatorStatusChange(val: string) {
        if (val == '1') {
            this.getIndicatorTaskList();
        } else {
            this.noneInicatorTaskTip = '';
        }
    }

    /**
     * @description: 删除指标任务
     * @param {type}
     */
    public deleteTask(task: Dictionary<any>, taskIndex: number) {
        task.status = 2;
    }

    /**
     * @description: 新增指标任务
     * @param {type}
     */
    public addTask() {
        let task = $.extend({}, this.defaultTaskData);
        task.id = (this.getMaxTaskId() + 1).toString();
        this.taskList.push(task);
    }

    /**
     * @description: 获取指标任务当前最大id值
     * @param {type}
     */
    public getMaxTaskId() {
        let maxId = 0;
        this.taskList.forEach((task: Dictionary<any>) => {
            if (task.id > maxId) {
                maxId = task.id;
            }
        });
        maxId = maxId > this.maxTaskId ? maxId : this.maxTaskId;
        this.maxTaskId = maxId + 1;
        return maxId;
    }
}

</script>

<style lang="scss" scoped>
.task-title {
    font-weight: bold;
    font-size: 14px;
}
.el-input-group__prepend {
    width: 50px;
}
</style>