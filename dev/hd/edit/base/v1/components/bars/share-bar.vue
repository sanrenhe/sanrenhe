<template>
    <div class="share">
        <!-- 对话框-自己 -->
        <div class="share_self shareBox">
            <!-- 微信分享-标题 -->
            <div class="share_title">
                <p v-edit-tap="{name:'share_title'}">
                    {{info.activity.share_set.share_title}}
                </p>
            </div>
            <!-- 微信分享-描述 -->
            <div class="share_info">
                <p v-edit-tap="{name:'share_desc'}">
                    {{info.activity.share_set.share_desc}}
                </p>
            </div>
            <!-- 微信分享-图片 -->
            <div class="share_pic">
                <img
                    v-edit-tap="{name:'share_pic'}"
                    :src="info.activity.share_set.share_pic"
                >
            </div>
        </div>
        <!-- 对话框-朋友 -->
        <div class="share_friend shareBox">
            <!-- 微信分享-标题 -->
            <div class="share_title">
                <p>
                    {{info.activity.share_set.share_title}}
                </p>
            </div>
            <!-- 微信分享-描述 -->
            <div class="share_info">
                {{info.activity.share_set.share_desc}}
            </div>
            <!-- 微信分享-图片 -->
            <div class="share_pic">
                <img
                    :src="info.activity.share_set.share_pic"
                    alt=""
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Bar from './bar';

@Component
export default class ShareBar extends Bar {
    constructor() {
        super({ 'warn': '活动开启后不可更改' })
    }

}

</script>


<style lang="scss" scoped>
.share {
    width: 100%;
    height: 100%;
    background-image: url("../../assets/img/background_share.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .shareBox {
        .share_title {
            width: 180px;
            height: 20px;
            font-size: 14px;
            p {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        .share_info {
            height: 50px;
            width: 160px;
            color: #b8b6b5;
            font-size: 12px;
            float: left;
        }

        .share_pic {
            width: 40px;
            height: 40px;
            float: right;
            margin-right: 0.5rem;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    .share_self {
        width: 220px;
        height: 70px;
        position: absolute;
        padding-top: 85px;
        padding-left: 90px;
    }

    .share_friend {
        width: 220px;
        height: 70px;
        position: absolute;
        top: 220px;
        left: 70px;
    }
}
</style>
