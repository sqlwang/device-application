/**
 * 带a标签的树形
 * 此项目未使用
 */
Ext.define('ux.tree.Column', {
    extend: 'Ext.tree.Column',
    alias: 'widget.uxTreecolumn',
    listeners: {
        click: function (grid, td, rowIndex, columnIndex, e, record) {
            if (e.target.tagName === 'A') {
                this.fireEvent('linkclick', grid, record);
                return false;
            }
        }
    },
    renderer: function (value) {
        return Ext.util.Format.format('<a href="{0}" onclick="return false;">{0}</a>', value);
    }
});