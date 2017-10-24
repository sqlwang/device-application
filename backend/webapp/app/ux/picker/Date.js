/**
 * 参考于http://www.cnblogs.com/ganqiyin/p/5029633.html
 * 支持时分秒的日期控件
 */
Ext.define('ux.picker.Date', {
    extend: 'Ext.picker.Date',
    alias: 'widget.datetimepicker',
    //添加确定按钮
    okText: '确认',
    okTip: '确认',
    //加入时分秒确认按钮
    renderTpl: [
         '<div id="{id}-innerEl" data-ref="innerEl" role="presentation">',
             '<div class="{baseCls}-header">',
                 '<div id="{id}-prevEl" data-ref="prevEl" class="{baseCls}-prev {baseCls}-arrow" role="presentation" title="{prevText}"></div>',
                 '<div id="{id}-middleBtnEl" data-ref="middleBtnEl" class="{baseCls}-month" role="heading">{%this.renderMonthBtn(values, out)%}</div>',
                 '<div id="{id}-nextEl" data-ref="nextEl" class="{baseCls}-next {baseCls}-arrow" role="presentation" title="{nextText}"></div>',
             '</div>',
             '<table role="grid" id="{id}-eventEl" data-ref="eventEl" class="{baseCls}-inner" cellspacing="0" tabindex="0">',
                 '<thead>',
                     '<tr role="row">',
                         '<tpl for="dayNames">',
                             '<th role="columnheader" class="{parent.baseCls}-column-header" aria-label="{.}">',
                                 '<div role="presentation" class="{parent.baseCls}-column-header-inner">{.:this.firstInitial}</div>',
                             '</th>',
                         '</tpl>',
                     '</tr>',
                 '</thead>',
                 '<tbody>',
                     '<tr role="row">',
                         '<tpl for="days">',
                             '{#:this.isEndOfWeek}',
                             '<td role="gridcell">',
                                 '<div hidefocus="on" class="{parent.baseCls}-date"></div>',
                             '</td>',
                         '</tpl>',
                     '</tr>',
                 '</tbody>',
             '</table>',
             '<tpl if="showToday">',
                 //'<div id="{id}-footerEl" data-ref="footerEl" role="presentation" class="{baseCls}-footer">{%this.renderTodayBtn(values, out)%}</div>',
               //'<div id="{id}-footerEl" role="presentation" data-ref="footerEl" class="{baseCls}-footer"><div>{%this.renderHour(values, out)%}{%this.renderMinute(values, out)%}{%this.renderSecond(values, out)%}</div><div>{%this.renderOkQueDingBtn(values, out)%}&nbsp;&nbsp;{%this.renderTodayBtn(values, out)%}</div></div>',
               '<div id="{id}-footerEl" role="presentation" data-ref="footerEl" class="{baseCls}-footer"><div>{%this.renderHour(values, out)%}{%this.renderMinute(values, out)%}</div><div>{%this.renderOkQueDingBtn(values, out)%}&nbsp;&nbsp;{%this.renderTodayBtn(values, out)%}</div></div>',
             '</tpl>',
             // These elements are used with Assistive Technologies such as screen readers
             '<div id="{id}-todayText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{todayText}.</div>',
             '<div id="{id}-todayText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{okText}.</div>',
             '<div id="{id}-ariaMinText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaMinText}.</div>',
             '<div id="{id}-ariaMaxText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaMaxText}.</div>',
             '<div id="{id}-ariaDisabledDaysText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaDisabledDaysText}.</div>',
             '<div id="{id}-ariaDisabledDatesText" class="' + Ext.baseCSSPrefix + 'hidden-clip">{ariaDisabledDatesText}.</div>',
         '</div>',
         {
             firstInitial: function (value) {
                 return Ext.picker.Date.prototype.getDayInitial(value);
             },
             isEndOfWeek: function (value) {
                 // convert from 1 based index to 0 based
                 // by decrementing value once.
                 value--;
                 var end = value % 7 === 0 && value !== 0;
                 return end ? '</tr><tr role="row">' : '';
             },
             longDay: function (value) {
                 return Ext.Date.format(value, this.longDayFormat);
             },
             renderHour: function (values, out) {
                 //out.push('<font style="float:left;">&nbsp;&nbsp;</font>');
                 Ext.DomHelper.generateMarkup(values.$comp.hour.getRenderTree(), out);
             },
             renderMinute: function (values, out) {
                 //out.push('<font style="float:left;font-weight:bold;">&nbsp:&nbsp;&nbsp;</font>');
                 Ext.DomHelper.generateMarkup(values.$comp.minute.getRenderTree(), out);
             },
             //renderSecond: function (values, out) {
             //    //out.push('<font style="float:left;font-weight:bold;">&nbsp:&nbsp;&nbsp;</font>');
             //    Ext.DomHelper.generateMarkup(values.$comp.second.getRenderTree(), out);
             //},
             renderOkQueDingBtn: function (values, out) {
                 Ext.DomHelper.generateMarkup(values.$comp.okQueDingBtn.getRenderTree(), out);
             },
             renderTodayBtn: function (values, out) {
                 Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
             },
             renderMonthBtn: function (values, out) {
                 Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
             }
         }
    ],
    beforeRender: function () {
        var me = this;
        //加入小时
        me.hour = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            minValue: 0,
            maxValue: 23,
            width: 70,
            editable: true,
            msgTarget: 'none',
            style: {
                float: "left"
            },
            value: 0,
            margin: '0 0 5 10',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (field.getValue() > 23) {
                        e.stopEvent();
                        field.setValue(23);
                    }
                }
            }
        });
        //加入分
        me.minute = Ext.create('Ext.form.field.Number', {
            scope: me,
            ownerCt: me,
            style: {
                float: "left"
            },
            value: 0,
            labelWidth: 10,
            fieldLabel: '&nbsp;',
            margin: '0 0 5 0',
            ownerLayout: me.getComponentLayout(),
            minValue: 0,
            maxValue: 59,
            editable: true,
            msgTarget: 'none',
            width: 85,
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (field.getValue() > 59) {
                        e.stopEvent();
                        field.setValue(59);
                    }
                }
            }
        });
        ////加入秒
        //me.second = Ext.create('Ext.form.field.Number', {
        //    scope: me,
        //    ownerCt: me,
        //    editable: true,
        //    style: {
        //        float: "left"
        //    },
        //    value: 0,
        //    labelWidth: 10,
        //    fieldLabel: '&nbsp;',
        //    margin: '0 0 5 0',
        //    ownerLayout: me.getComponentLayout(),
        //    minValue: 0,
        //    maxValue: 59,
        //    width: 80,
        //    enableKeyEvents: true,
        //    listeners: {
        //        keyup: function (field, e) {
        //            if (field.getValue() > 59) {
        //                e.stopEvent();
        //                field.setValue(59);
        //            }
        //        }
        //    }
        //});
        //加入确认按钮
        me.okQueDingBtn = new Ext.button.Button({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            text: me.okText,
            tooltip: me.okTip,
            margin: '0 0 5 10',
            tooltipType: 'title',
            handler: me.okQueDingHandler,
            //确认按钮的事件委托  
            scope: me
        });
        me.callParent(arguments);

    },
    //添加更新时间的事件
    update: function (date, forceRefresh) {
        var me = this;
        //添加时间相关
        date.setHours(me.hour.getValue());
        date.setMinutes(me.minute.getValue());
        //date.setSeconds(me.second.getValue());
        return me.callParent(arguments);
    },
    /** 
     * 确认 按钮触发的调用 
     */
    okQueDingHandler: function () {
        var me = this,
        btn = me.okQueDingBtn;

        if (btn && !btn.disabled) {
            me.setValue(this.getValue());
            me.fireEvent('select', me, me.value);
            me.onSelect();
        }
        return me;
    },
    //销毁确定按钮
    beforeDestroy: function () {
        var me = this;

        if (me.rendered) {
            Ext.destroy(me.okQueDingBtn);
        }
        me.callParent();
    },
    privates: {
        //触发新增子控件的onRender方法
        finishRenderChildren: function () {
            var me = this;

            me.callParent();
            me.okQueDingBtn.finishRender();
            //添加时间相关
            me.hour.finishRender();
            me.minute.finishRender();
            //me.second.finishRender();
        }
    }
});