/**
 * 扩展Ext.tree.Column鼠标移动到上面可以显示内容，以防文字太长被截取
 */
Ext.define('ux.tree.TipColumn', {
    extend: 'Ext.tree.Column',
    alias: 'widget.uxTreeTipColumn',
    renderer: function (v, cellValues, record, rowIdx, colIdx, store, view) {
        return Ext.util.Format.format('<span data-qtip="{0}">{0}</span>', v);
    }
});