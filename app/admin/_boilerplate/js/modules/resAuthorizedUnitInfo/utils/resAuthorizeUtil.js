/**
 * Created by linj on 2018/6/4 19:13.
 */
define(function (resAuthorizeManage) {
    'use strict';
    return [function(){


        function questionTypeEnum(type,value) {
            this.type = type;
            this.value = value;
        }
        function authorizeStatusEnum(type,value) {
            this.type = type;
            this.value = value;
        }
        function resourceCE(englishCode,chineseName) {
            this.englishCode = englishCode;
            this.chineseName = chineseName;
        }

        var questionTypeConst={
            JUDGE:"JUDGE",
            RADIO:"RADIO",
            MULTI_SELECT:"MULTI_SELECT"
        };
        var authorizeStatusConst={
            AUTHORIZATION:"AUTHORIZATION",
            CANCEL_AUTHORIZATION:"CANCEL_AUTHORIZATION",
        };
        return{
            deCodeQuestionType:function (type) {
                switch (type){
                    case questionTypeConst.JUDGE:
                        return "判断题";
                    case questionTypeConst.RADIO:
                        return "单选题";
                    case questionTypeConst.MULTI_SELECT:
                        return "多选题";
                    default :
                        return "未知";
                }
            },
            deCodeQuestionDifficultyType:function (difficultyType) {
                switch (difficultyType){
                    case "EASY":
                        return "简单";
                    case "NORMAL":
                        return "普通";
                    case "DIFFICULTY":
                        return "困难";
                    default :
                        return "未知";
                }
            },
            deCodePaperExamConfigType:function (configType) {
                switch (configType){
                    case "FIX":
                        return "固定卷";
                    case "AB":
                        return "AB卷";
                    case "RANDOM":
                        return "随机卷";
                    default :
                        return "未知";
                }
            },
            getQuestionTypeOption:function () {
                return [
                    new questionTypeEnum("请选择试题类型",""),
                    new questionTypeEnum(this.deCodeQuestionType(questionTypeConst.JUDGE),questionTypeConst.JUDGE),
                    new questionTypeEnum(this.deCodeQuestionType(questionTypeConst.RADIO),questionTypeConst.RADIO),
                    new questionTypeEnum(this.deCodeQuestionType(questionTypeConst.MULTI_SELECT),questionTypeConst.MULTI_SELECT)
                ]
            },
            getAuthorizeStatusOption:function () {
                return [
                    new authorizeStatusEnum("请选择授权状态",""),
                    new authorizeStatusEnum("授权使用中",authorizeStatusConst.AUTHORIZATION),
                    new authorizeStatusEnum("已取消授权",authorizeStatusConst.CANCEL_AUTHORIZATION),
                ]
            },
            getResourceCECode:function () {
                return{
                    COURSE:"课程",
                    COURSE_POOL:"课程包",
                    EXAM_PAPER:"考试卷",
                    QUESTION_LIBRARY:"题库",
                }
            }
        }
    }];
});