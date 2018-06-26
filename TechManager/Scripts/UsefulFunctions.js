// Functions
function LogOutSafe() {
    window.localStorage.setItem('login', false);
    window.location = '/Account/Logout';
}

function IsNullOrEmpty(item) {
    return item === '' || item === null || item === undefined || item === 0;
}

function ContainsModel(models, ID) {
    var result = false;
    angular.forEach(models, function (m) {
        if (ID === m.ID || ID === m.Id || ID === m.id) {
            result = true;
        }
    });
    return result;
}

function ContainsModelByProductID(models, ProductID) {
    var result = false;
    angular.forEach(models, function (m) {
        if (ProductID === m.ProductID) {
            result = true;
        }
    });
    return result;
}

function GetModelByID(models, ID) {
    var result = null;
    angular.forEach(models, function (m) {
        if (ID === m.ID || ID === m.id || ID === m.Id) {
            result = m;
        }
    });
    return result;
}

function GetNotDeletedObjects(items) {
    var result = [];

    angular.forEach(items, function (item) {
        if (!item.Deleted) {
            result.push(item);
        }
    });

    return result;
}

function GetCheckedItemsCount(items) {
    var checkedCount = 0;
    angular.forEach(items, function (item) {
        checkedCount += item.checked;
    });
    return checkedCount;
}

function GetCheckedItems(items) {
    var result = [];

    angular.forEach(items, function (item) {
        if (item.checked) {
            result.push(item);
        }
    });

    return result;
}

function UncheckItems(items) {
    angular.forEach(items, function (item) {
        item.checked = false;
    });

    return items;
}

function GetFieldsFromObjectsCollection(items, fieldName) {
    var result = '';

    angular.forEach(items, function (item) {
        result += item[fieldName] + ',';
    });

    if (!IsNullOrEmpty(result)) {
        result = result.slice(0, -1);
    }

    return result;
}

var EnumActionTypes = {
    Other: 0,
    Products: 1
}

var EnumVisitStatuses = {
    Unsigned: 0,
    Signed: 1
}

var EnumProductPaths = {
    //Goods: '0#1#10#11',
    Goods: '',
    Services: '0#2#110'
}

var EnumCurrencies = {
    GEL: 1,
    USD: 2,
    EUR: 3
}

var SaleTypes = [
    'რეალიზაცია',
    'შეცვლა',
    'დამატება',
    'მოხსნა',
    'გახარჯვა',
    'ჩამოწერა'
]
// ---


//Where
Array.prototype.Where = function (expression) {
    var items = [],
        length = this.length;

    for (var i = 0; i < length; i++) {
        if (eval('this[i].' + expression))
            items.push(this[i]);
    }

    return items.length == 0 ? null : items;
}


//Any
Array.prototype.Any = function (expression) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
        if (eval('this[i].' + expression))
            return true;
    }

    return false;
}


//First
Array.prototype.First = function (expression) {
    var length = this.length,
        item = null;

    for (var i = 0; i < length; i++) {
        if (eval('this[i].' + expression)) {
            item = this[i];
            break;
        }
    }

    return item;
}


//Last
Array.prototype.Last = function (expression) {
    var length = this.length - 1,
        item = null;

    for (var i = length; i >= 0; i--) {
        if (eval('this[i].' + expression)) {
            item = this[i];
            break;
        }
    }

    return item;
}


//Select
Array.prototype.Select = function (field) {
    var length = this.length,
        items = [];

    for (var i = 0; i < length; i++) {
        items.push(eval('this[i].' + field));
    }

    return items;
}


//Max
Array.prototype.Max = function (field) {
    return field == undefined ? Math.max.apply(null, this) : Math.max.apply(null, this.Select(field));
};


//Min
Array.prototype.Min = function (field) {
    return field == undefined ? Math.min.apply(null, this) : Math.min.apply(null, this.Select(field));
};


//ForEach
Array.prototype.ForEach = function (_function) {
    var length = this.length;

    for (var i = 0; i < length; i++) {
        _function(this[i]);
    }

    return 'array length: ' + length;
}


//IsUndefinedNullOrEmpty
function IsUndefinedNullOrEmpty(item) {
    return item == undefined || item == null || item == '';
}


//Sum
Array.prototype.Sum = function (field) {
    var sum = 0;

    for (var i = 0; i < this.length; i++) {
        if (!this[i].Deleted) {
            sum += eval('this[i].' + field);
        }
    }

    return Math.round(sum * 100) / 100;
}