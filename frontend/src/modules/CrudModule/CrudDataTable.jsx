import React, { useEffect, useState } from "react";


import { Button, Menu, Modal } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectItemById } from "@/redux/crud/selectors";
import { useCrudContext } from "@/context/crud";
import uniqueId from "@/utils/uinqueId";
import DataTable from "@/components/DataTable";

function AddNewItem({ config }) {
    const { crudContextAction } = useCrudContext();
    const { collapsedBox, panel } = crudContextAction;
    const { ADD_NEW_ENTITY } = config;
    const handelClick = () => {
        panel.open();
        collapsedBox.close();
    };

    return (
        <Button onClick={handelClick} type="primary">
            {ADD_NEW_ENTITY}
        </Button>
    );
}

function DropDownRowMenu({ row }) {
    const dispatch = useDispatch();
    const { crudContextAction } = useCrudContext();
    const { panel, collapsedBox, modal, readBox, editBox } = crudContextAction;
    const item = useSelector(selectItemById(row._id));
    const [banPopup, setBanPopup] = useState(false);
    const Show = () => {
        dispatch(crud.currentItem(item));
        panel.open();
        collapsedBox.open();
        readBox.open();
    };

    function Edit() {
        if (item.user_id && typeof item.user_id === "object") {
            item.user_id = item.user_id._id;
        }
        dispatch(crud.currentAction("update", item));
        editBox.open();
        panel.open();
        collapsedBox.open();
    }

    function Delete() {
        dispatch(crud.currentAction("delete", item));
        modal.open();
    }

    function BanUser() {
        setBanPopup(true)
    }

    return (
        <React.Fragment>
            <Menu style={{ width: 130 }}>
                <Menu.Item key={`${uniqueId()}`} icon={<EyeOutlined />} onClick={Show}>
                    Show
                </Menu.Item>
                <Menu.Item key={`${uniqueId()}`} icon={<EditOutlined />} onClick={Edit}>
                    Edit
                </Menu.Item>
                <Menu.Item
                    key={`${uniqueId()}`}
                    icon={<DeleteOutlined />}
                    onClick={Delete}
                >
                    {item?.isDeleted ? 'UnDelete' : 'Delete'}
                </Menu.Item>
                {item.hasOwnProperty('status') &&
                    <Menu.Item key={`${uniqueId()}`} icon={<UserDeleteOutlined />} onClick={BanUser}>
                        {item?.status ? 'Ban' : 'Unban'}
                    </Menu.Item>}
            </Menu>
            <BanUserModal ban={item?.status} onClose={() => setBanPopup(false)} open={banPopup} _id={item._id} />
        </React.Fragment>
    );
}

export default function CrudDataTable({ config }) {
    return (
        <DataTable
            config={config}
            DropDownRowMenu={DropDownRowMenu}
            AddNewItem={AddNewItem}
        />
    );
}

const BanUserModal = ({ _id, open, ban, onClose }) => {
    const dispatch = useDispatch();
    const [confirmationBan, setConfirmationBan] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) setConfirmationBan(true)
    }, [open]);

    const handleOk = () => {
        if (_id) {
            setLoading(true)
            dispatch(crud.banUser(_id, ban, res => {
                setLoading(false)
                onClose(false)
                setConfirmationBan(false)
                if (res.success) {
                    dispatch(crud.list('profile'));
                    dispatch(crud.resetAction('profile'));
                }
            }));
        }
    }
    const handleCancel = () => {
        onClose(false)
        setConfirmationBan(false)
    }
    return <Modal
        title={ban ? "Ban" : "Unban" + " User"}
        open={confirmationBan}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
    >
        <p>Are you sure want to {ban ? "Ban" : "Unban"} this user ?</p>
    </Modal>
}