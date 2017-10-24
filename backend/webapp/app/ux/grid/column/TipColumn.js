/**
 * 扩展Ext.grid.column.Column鼠标移动到上面可以显示内容，以防文字太长被截取
 */
Ext.define('ux.grid.column.TipColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.uxTipColumn',
    renderer: function (v) {
        return Ext.util.Format.format('<span data-qtip="{0}">{0}</span>', v);
    }
});