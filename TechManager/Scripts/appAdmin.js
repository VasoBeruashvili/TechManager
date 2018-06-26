// Application
var app = angular.module('TechManager', ['ui.bootstrap', 'angularGrid']);
// ---



// Models and Custom types
app.actionTypes = [
    'სხვა',
    'მასალები'
];
// ---



// Navigation Menu
app.controller('NavMenuAdminController', function ($scope, $http) {
    $scope.init = function () {
        if (location.href.indexOf("Equipments") > -1) {
            $scope.Equipments = 'active';
        }
        if (location.href.indexOf("Actions") > -1) {
            $scope.Actions = 'active';
        }
        if (location.href.indexOf("EquipmentTypes") > -1) {
            $scope.EquipmentTypes = 'active';
        }
        if (location.href.indexOf("ProgramVersions") > -1) {
            $scope.ProgramVersions = 'active';
        }

        $http.get('/Home/InitPage').then(function (response) {
            $scope.userName = response.data.userName;            
        });        
    }
});


app.controller('NavMenuEngineerController', function ($scope, $http) {
    $scope.init = function () {
        if (location.href.indexOf("Visits") > -1) {
            $scope.Visits = 'active';
        }

        $http.get('/Home/InitPage').then(function (response) {
            $scope.userName = response.data.userName;
        });
    }
});
// ---



// EquipmentGroups and Equipments
app.controller('EquipmentGroupsController', function ($scope, $http, $modal) {
    $scope.init = function () {
        window.addEventListener('resize', function (event) {
            $('#containerEquipments').css("height", $(window).height() - 120);
        });
        $('#containerEquipments').css("height", $(window).height() - 120);

        app.GetEquipmentGroupsWithEquipments = function () {
            $http.get('/Home/GetEquipmentGroupsWithEquipments').then(function (response) {
                $scope.gridOptions.rowData = response.data.equipmentGroups;
                $scope.gridOptions.api.onNewRows();
                $scope.gridOptions.api.sizeColumnsToFit();
            });
        }
        app.GetEquipmentGroupsWithEquipments(); //Call this for startup load grid
    }

    var columnDefs = [
        { headerName: 'ID', field: 'ID', suppressSizeToFit: true },
        { headerName: 'ჯგუფის დასახელება', field: 'Name' }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenEquipmentGroupsModal('რედაქტირება', row.data);
        }
    }

    $scope.OpenEquipmentGroupsModal = function (title, rowData) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'EquipmentGroupModal.html',
            controller: 'EquipmentGroupModalController',
            size: 'lg',
            backdrop: 'static'
        });

        app.topNumber = -1;

        if (rowData === undefined) {
            modalInstance.title = 'რედაქტირება';
        }
        modalInstance.title = title;
        modalInstance.ID = rowData === undefined ? 0 : rowData.ID;
        modalInstance.Name = rowData === undefined ? '' : rowData.Name;
        app.Equipments = rowData === undefined ? [] : rowData.Equipments;
    }
});


app.controller('EquipmentGroupModalController', function ($scope, $http, $modalInstance, $modal) {
    $scope.title = $modalInstance.title;
    $scope.ID = $modalInstance.ID;
    $scope.Name = $modalInstance.Name;

    if ($scope.title == 'რედაქტირება') {
        $scope.showDeleteButton = true;
    }

    $scope.init = function () {
        $scope.gridOptions.rowData = app.Equipments;
    }

    var columnDefs = [
        { headerName: 'ID', field: 'ID' },
        { headerName: 'მოწყობილობის დასახელება', field: 'Name', width: 645 }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenEquipmentsModal('რედაქტირება', row.data);
        }
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.Save = function (deleted) {       
        if ($scope.Validate()) {
            var equipmentGroupModel = {
                ID: $scope.ID,
                Name: $scope.Name,
                Equipments: app.Equipments,
                Deleted: deleted
            };            

            $http.post('/Home/SaveEquipmentGroupWithEquipments', { equipmentGroupModel: equipmentGroupModel }).then(function (response) {
                if (response.data.saveResult) {
                    $scope.Cancel();
                    $scope.gridOptions.api.showLoading(true);
                    app.GetEquipmentGroupsWithEquipments();
                } else {
                    alert('მონაცემები ვერ შეინახა!');
                }
            });
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.Name);
        if (!result) {
            $('#txtEquipmentGroupName').css('borderColor', '#FF2000');
        } else {
            $('#txtEquipmentGroupName').css('borderColor', '#CCC');
        }

        return result;
    }

    $scope.OpenEquipmentsModal = function (title, rowData) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'EquipmentModal.html',
            controller: 'EquipmentModalController',
            size: 'md',
            backdrop: 'static'
        });
        modalInstance.title = title;
        modalInstance.ID = rowData === undefined ? 0 : rowData.ID;
        modalInstance.Name = rowData === undefined ? '' : rowData.Name;
        modalInstance.EquipmentGroupID = $scope.ID;

        modalInstance.gridOptions = $scope.gridOptions;
    }
});


app.controller('EquipmentModalController', function ($scope, $http, $modalInstance) {
    $scope.title = $modalInstance.title;
    if ($scope.title === 'რედაქტირება') {
        $scope.showDeleteButton = true;
    }
    $scope.ID = $modalInstance.ID;
    $scope.Name = $modalInstance.Name;
    $scope.EquipmentGroupID = $modalInstance.EquipmentGroupID;

    $scope.gridOptions = $modalInstance.gridOptions;

    $scope.Save = function (toClose, deleted) {
        if ($scope.Validate()) {
            if (!IsNullOrEmpty($scope.Name)) {
                if (!ContainsModel(app.Equipments, $scope.ID)) {
                    app.Equipments.push({
                        ID: app.topNumber,
                        Name: $scope.Name,
                        EquipmentGroupID: $scope.EquipmentGroupID
                    });
                    app.topNumber--;
                } else {
                    var equipmentModel = GetModelByID(app.Equipments, $scope.ID);                    

                    if (deleted) {
                        equipmentModel.Deleted = true;
                        $scope.gridOptions.rowData = GetNotDeletedObjects(app.Equipments);
                    } else {
                        equipmentModel.Name = $scope.Name;
                    }
                }
                if (toClose) $scope.Cancel();
                $scope.gridOptions.api.onNewRows();
            }
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.Name);
        if (!result) {
            $('#txtEquipmentName').css('borderColor', '#FF2000');
        } else {
            $('#txtEquipmentName').css('borderColor', '#CCC');
        }

        return result;
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
// ---



// Actions and ActionItems
app.controller('ActionsController', function ($scope, $http, $modal) {
    $scope.init = function () {
        window.addEventListener('resize', function (event) {
            $('#containerActions').css("height", $(window).height() - 120);
        });
        $('#containerActions').css("height", $(window).height() - 120);

        app.GetActionsWithActionItems = function () {
            $http.get('/Home/GetActionsWithActionItems').then(function (response) {
                angular.forEach(response.data.actions, function (action) {
                    action.ActionTypeName = app.actionTypes[action.ActionTypeID];
                });

                $scope.gridOptions.rowData = response.data.actions;
                $scope.gridOptions.api.onNewRows();
                $scope.gridOptions.api.sizeColumnsToFit();
            });
        }
        app.GetActionsWithActionItems(); //Call this for startup load grid
    }

    var columnDefs = [
        { headerName: 'ID', field: 'ID', suppressSizeToFit: true },
        { headerName: 'მოქმედების დასახელება', field: 'Name' },
        { headerName: 'მოქმედების ტიპი', field: 'ActionTypeName', width: 300, suppressSizeToFit: true },
        { headerName: 'დამალული', field: 'isHidden', width: 100, suppressSizeToFit: true }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenActionsModal('რედაქტირება', row.data);
        }
    }

    $scope.OpenActionsModal = function (title, rowData) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'ActionModal.html',
            controller: 'ActionModalController',
            size: 'lg',
            backdrop: 'static'
        });

        app.topNumber = -1;

        if (rowData === undefined) {
            modalInstance.title = 'რედაქტირება';
        }
        modalInstance.title = title;
        modalInstance.ID = rowData === undefined ? 0 : rowData.ID;
        modalInstance.isHidden = rowData === undefined ? false : rowData.isHidden;
        modalInstance.Name = rowData === undefined ? '' : rowData.Name;
        modalInstance.ActionType = rowData === undefined ? 0 : rowData.ActionTypeID;
        app.ActionItems = rowData === undefined ? [] : rowData.ActionItems;
    }
});


app.controller('ActionModalController', function ($scope, $http, $modal, $modalInstance) {
    $scope.title = $modalInstance.title;
    if ($scope.title === 'რედაქტირება') {
        $scope.showDeleteButton = true;
    }
    $scope.ID = $modalInstance.ID;
    $scope.Name = $modalInstance.Name;
    $scope.ActionType = $modalInstance.ActionType;
    $scope.isHidden = $modalInstance.isHidden;

    $scope.init = function () {
        $scope.gridOptions.rowData = app.ActionItems;
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.actionTypes = app.actionTypes;

    $scope.selectedActionType = $scope.actionTypes[$scope.ActionType];

    $scope.selectActionType = function (actionTypeIndex) {
        $scope.selectedActionType = $scope.actionTypes[actionTypeIndex];     
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.Name);
        if (!result) {
            $('#txtActionName').css('borderColor', '#FF2000');
        } else {
            $('#txtActionName').css('borderColor', '#CCC');
        }

        return result;
    }

    $scope.Save = function (deleted) {
        if ($scope.Validate()) {
            var actionModel = {
                ID: $scope.ID,
                Name: $scope.Name,
                ActionItems: app.ActionItems,
                ActionTypeID: $scope.actionTypes.indexOf($scope.selectedActionType),
                Deleted: deleted,
                isHidden: $scope.isHidden
            };

            $http.post('/Home/SaveActionWithActionItems', { actionModel: actionModel }).then(function (response) {
                if (response.data.saveResult) {
                    $scope.Cancel();
                    $scope.gridOptions.api.showLoading(true);
                    app.GetActionsWithActionItems();
                } else {
                    alert('მონაცემები ვერ შეინახა!');
                }
            });
        }
    }

    var columnDefs = [
        { headerName: 'ID', field: 'ID' },
        { headerName: 'კატეგორიის დასახელება', field: 'Name', width: 645 },
        { headerName: 'დამალული', field: 'isHidden', width: 100, suppressSizeToFit: true }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenActionItemsModal('რედაქტირება', row.data);
        }
    }

    $scope.OpenActionItemsModal = function (title, rowData) {              
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'ActionItemModal.html',
            controller: 'ActionItemModalController',
            size: 'md',
            backdrop: 'static'
        });
        modalInstance.title = title;
        modalInstance.ID = rowData === undefined ? 0 : rowData.ID;
        modalInstance.isHidden = rowData === undefined ? false : rowData.isHidden;
        modalInstance.hasSerial = rowData === undefined ? false : rowData.hasSerial;
        modalInstance.Name = rowData === undefined ? '' : rowData.Name;
        modalInstance.ActionID = $scope.ID;
        modalInstance.ProductID = rowData === undefined ? null : rowData.ProductID;
        modalInstance.gridOptions = $scope.gridOptions;            
        app.SubActionItems = rowData === undefined ? [] : rowData.subActionItems;
        modalInstance.selectedActionType = $scope.actionTypes.indexOf($scope.selectedActionType);
    }    
});


app.controller('ActionItemModalController', function ($scope, $modal, $modalInstance) {
    $scope.title = $modalInstance.title;
    if ($scope.title === 'რედაქტირება') {
        $scope.showDeleteButton = true;
    }
    $scope.ID = $modalInstance.ID;
    $scope.isHidden = $modalInstance.isHidden;
    $scope.hasSerial = $modalInstance.hasSerial;
    $scope.Name = $modalInstance.Name;
    $scope.ActionID = $modalInstance.ActionID;
    $scope.ProductID = $modalInstance.ProductID;
    $scope.actionTypes = $modalInstance.actionTypes;
    $scope.selectedActionType = $modalInstance.selectedActionType;

    $scope.gridOptions = $modalInstance.gridOptions;

    $scope.Save = function (toClose, deleted) {
        if ($scope.Validate()) {
            if (!IsNullOrEmpty($scope.Name)) {
                if (!ContainsModel(app.ActionItems, $scope.ID)) {
                    app.ActionItems.push({
                        ID: app.topNumber,
                        Name: $scope.Name,
                        ActionID: $scope.ActionID,
                        ProductID: $scope.ProductID,
                        subActionItems: app.SubActionItems,
                        isHidden: $scope.isHidden,
                        hasSerial: $scope.hasSerial
                    });
                    app.topNumber--;
                } else {
                    var actionItemModel = GetModelByID(app.ActionItems, $scope.ID);

                    if (deleted) {
                        actionItemModel.Deleted = true;
                        $scope.gridOptions.rowData = GetNotDeletedObjects(app.ActionItems);
                    } else {
                        actionItemModel.Name = $scope.Name;
                        actionItemModel.isHidden = $scope.isHidden;
                        actionItemModel.hasSerial = $scope.hasSerial;
                    }
                }
                if (toClose) $scope.Cancel();
                $scope.gridOptions.api.onNewRows();
            }
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.Name);
        if (!result) {
            $('#txtActionItemName').css('borderColor', '#FF2000');
        } else {
            $('#txtActionItemName').css('borderColor', '#CCC');
        }

        return result;
    }
    
    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    // Sub Action Items
    var columnDefsSub = [
        { headerName: 'ID', field: 'id' },
        { headerName: 'ქვე-კატეგორიის დასახელება', field: 'name', width: 350 },
        { headerName: 'დამალული', field: 'isHidden', width: 100, suppressSizeToFit: true }
    ];

    $scope.gridOptionsSub = {
        columnDefs: columnDefsSub,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenSubActionItemsModal('რედაქტირება', row.data);
        }
    }

    $scope.init = function () {
        $scope.gridOptionsSub.rowData = app.SubActionItems;
    }

    $scope.OpenSubActionItemsModal = function (title, rowData) {       
        if ($scope.selectedActionType === EnumActionTypes.Other) {           
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'SubActionItemModal.html',
                controller: 'SubActionItemModalController',
                size: 'md',
                backdrop: 'static'
            });
            modalInstance.title = title;
            modalInstance.id = rowData === undefined ? 0 : rowData.id;
            modalInstance.isHidden = rowData === undefined ? false : rowData.isHidden;
            modalInstance.name = rowData === undefined ? '' : rowData.name;
            modalInstance.actionItemId = $scope.ID;
            modalInstance.gridOptions = $scope.gridOptionsSub;
            modalInstance.readOnlyName = false;
        } else if ($scope.selectedActionType === EnumActionTypes.Products && title === 'დამატება') {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'ProductModal.html',
                controller: 'ProductModalController',
                size: 'lg',
                backdrop: 'static'
            });
            modalInstance.title = title;
            modalInstance.ActionID = $scope.ID;
            modalInstance.isHidden = rowData === undefined ? false : rowData.isHidden;
            modalInstance.actionItemId = $scope.ID;
            modalInstance.gridOptions = $scope.gridOptionsSub;
        } else if ($scope.selectedActionType === EnumActionTypes.Products && title === 'რედაქტირება') {
            var modalInstance = $modal.open({
                animation: false,
                templateUrl: 'SubActionItemModal.html',
                controller: 'SubActionItemModalController',
                size: 'md',
                backdrop: 'static'
            });
            modalInstance.title = title;
            modalInstance.id = rowData === undefined ? 0 : rowData.id;
            modalInstance.isHidden = rowData === undefined ? false : rowData.isHidden;
            modalInstance.name = rowData === undefined ? '' : rowData.name;
            modalInstance.actionItemId = $scope.ID;
            modalInstance.gridOptions = $scope.gridOptionsSub;
            modalInstance.readOnlyName = true;
        }
    }
    // ---
});


app.controller('SubActionItemModalController', function ($scope, $modal, $modalInstance) {
    $scope.title = $modalInstance.title;
    if ($scope.title === 'რედაქტირება') {
        $scope.showDeleteButton = true;
    }
    $scope.id = $modalInstance.id;
    $scope.isHidden = $modalInstance.isHidden;
    $scope.name = $modalInstance.name;
    $scope.actionItemId = $modalInstance.actionItemId;
    $scope.readOnlyName = $modalInstance.readOnlyName;

    $scope.gridOptions = $modalInstance.gridOptions;

    $scope.Save = function (toClose, deleted) {
        if ($scope.Validate()) {
            if (!IsNullOrEmpty($scope.name)) {
                if (!ContainsModel(app.SubActionItems, $scope.id)) {
                    app.SubActionItems.push({
                        id: app.topNumber,
                        name: $scope.name,
                        actionItemId: $scope.actionItemId,
                        isHidden: $scope.isHidden
                    });
                    app.topNumber--;
                } else {
                    var subActionItemModel = GetModelByID(app.SubActionItems, $scope.id);

                    if (deleted) {
                        subActionItemModel.Deleted = true;
                        $scope.gridOptions.rowData = GetNotDeletedObjects(app.SubActionItems);
                    } else {
                        subActionItemModel.name = $scope.name;
                        subActionItemModel.isHidden = $scope.isHidden;
                    }
                }
                if (toClose) $scope.Cancel();
                $scope.gridOptions.api.onNewRows();
            }
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.name);
        if (!result) {
            $('#txtSubActionItemName').css('borderColor', '#FF2000');
        } else {
            $('#txtSubActionItemName').css('borderColor', '#CCC');
        }

        return result;
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
// ---



// EquipmentTypes
app.controller('EquipmentTypesController', function ($scope, $http, $modal) {
    $scope.init = function () {
        window.addEventListener('resize', function (event) {
            $('#containerEquipmentTypes').css("height", $(window).height() - 120);
        });
        $('#containerEquipmentTypes').css("height", $(window).height() - 120);

        app.GetEquipmentTypes = function () {
            $http.get('/Home/GetEquipmentTypes').then(function (response) {
                $scope.gridOptions.rowData = response.data.equipmentTypes;
                $scope.gridOptions.api.onNewRows();
                $scope.gridOptions.api.sizeColumnsToFit();
            });
        }
        app.GetEquipmentTypes(); //Call this for startup load grid
    }

    var columnDefs = [
        { headerName: 'ID', field: 'id', suppressSizeToFit: true },
        { headerName: 'აპარატის ტიპის დასახელება', field: 'name' }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenEquipmentTypesModal('რედაქტირება', row.data);
        }
    }

    $scope.OpenEquipmentTypesModal = function (title, rowData) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'EquipmentTypeModal.html',
            controller: 'EquipmentTypeModalController',
            size: 'md',
            backdrop: 'static'
        });

        if (rowData === undefined) {
            modalInstance.title = 'რედაქტირება';
        }
        modalInstance.title = title;
        modalInstance.ID = rowData === undefined ? 0 : rowData.id;
        modalInstance.Name = rowData === undefined ? '' : rowData.name;
    }
});


app.controller('EquipmentTypeModalController', function ($scope, $modalInstance, $http) {
    $scope.title = $modalInstance.title;
    $scope.ID = $modalInstance.ID;
    $scope.Name = $modalInstance.Name;

    $scope.showDeleteButton = $scope.title === 'დამატება' ? false : true;

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.Save = function (deleted) {
        if ($scope.Validate()) {
            var equipmentTypeModel = {
                id: $scope.ID,
                name: $scope.Name,
                Deleted: deleted
            };

            $http.post('/Home/SaveEquipmentType', { equipmentTypeModel: equipmentTypeModel }).then(function (response) {
                if (response.data.saveResult) {
                    $scope.Cancel();
                    app.GetEquipmentTypes();
                } else {
                    alert('მონაცემები ვერ შეინახა!');
                }
            });
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.Name);
        if (!result) {
            $('#txtEquipmentTypeName').css('borderColor', '#FF2000');
        } else {
            $('#txtEquipmentTypeName').css('borderColor', '#CCC');
        }

        return result;
    }
});
// ---



// ProgramVersions
app.controller('ProgramVersionsController', function ($scope, $http, $modal) {
    $scope.init = function () {
        window.addEventListener('resize', function (event) {
            $('#containerProgramVersions').css("height", $(window).height() - 120);
        });
        $('#containerProgramVersions').css("height", $(window).height() - 120);

        app.GetProgramVersions = function () {
            $http.get('/Home/GetProgramVersions').then(function (response) {
                $scope.gridOptions.rowData = response.data.programVersions;
                $scope.gridOptions.api.onNewRows();
                $scope.gridOptions.api.sizeColumnsToFit();
            });
        }
        app.GetProgramVersions(); //Call this for startup load grid
    }

    var columnDefs = [
        { headerName: 'ID', field: 'id', suppressSizeToFit: true },
        { headerName: 'პროგრამის ვერსიის დასახელება', field: 'name' }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.OpenProgramVersionsModal('რედაქტირება', row.data);
        }
    }

    $scope.OpenProgramVersionsModal = function (title, rowData) {
        var modalInstance = $modal.open({
            animation: false,
            templateUrl: 'ProgramVersionModal.html',
            controller: 'ProgramVersionModalController',
            size: 'md',
            backdrop: 'static'
        });

        if (rowData === undefined) {
            modalInstance.title = 'რედაქტირება';
        }
        modalInstance.title = title;
        modalInstance.ID = rowData === undefined ? 0 : rowData.id;
        modalInstance.Name = rowData === undefined ? '' : rowData.name;
    }
});


app.controller('ProgramVersionModalController', function ($scope, $modalInstance, $http) {
    $scope.title = $modalInstance.title;
    $scope.ID = $modalInstance.ID;
    $scope.Name = $modalInstance.Name;

    $scope.showDeleteButton = $scope.title === 'დამატება' ? false : true;

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.Save = function (deleted) {
        if ($scope.Validate()) {
            var programVersionModel = {
                id: $scope.ID,
                name: $scope.Name,
                Deleted: deleted
            };

            $http.post('/Home/SaveProgramVersion', { programVersionModel: programVersionModel }).then(function (response) {
                if (response.data.saveResult) {
                    $scope.Cancel();
                    app.GetProgramVersions();
                } else {
                    alert('მონაცემები ვერ შეინახა!');
                }
            });
        }
    }

    $scope.Validate = function () {
        var result = false;

        result = !IsNullOrEmpty($scope.Name);
        if (!result) {
            $('#txtProgramVersionName').css('borderColor', '#FF2000');
        } else {
            $('#txtProgramVersionName').css('borderColor', '#CCC');
        }

        return result;
    }
});
// ---



// Products
app.controller('ProductModalController', function ($scope, $http, $modalInstance) {
    $scope.title = $modalInstance.title;
    //$scope.ActionID = $modalInstance.ActionID;
    $scope.actionItemId - $modalInstance.actionItemId;
    $scope.actionItemGridOptions = $modalInstance.gridOptions;

    $scope.init = function () {
        $http.post('/Home/GetProducts', { path: EnumProductPaths.Goods }).then(function (response) {
            $scope.gridOptions.rowData = response.data.products;
            $scope.gridOptions.api.onNewRows();
        });
    }

    var columnDefs = [
        { headerName: 'ID', field: 'ID' },
        { headerName: 'საქონლის დასახელება', field: 'Name', width: 645 }
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        enableColResize: true,
        rowSelection: 'single',
        enableFilter: true,
        rowClicked: function (row) {
            $scope.ID = row.data.ID;
            $scope.Name = row.data.Name;
            $scope.ProductID = row.data.ID;
        }
    }

    $scope.Save = function (toClose) {
        if (!IsNullOrEmpty($scope.Name)) {
            app.SubActionItems.push({
                id: app.topNumber,
                name: $scope.Name,
                actionItemId: $scope.actionItemId,
                productId: $scope.ProductID
            });
            app.topNumber--;

            if (toClose) $scope.Cancel();
            $scope.actionItemGridOptions.api.onNewRows();
        }
    }

    $scope.Cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
// ---