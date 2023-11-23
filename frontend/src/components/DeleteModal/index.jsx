import React, { useEffect, useState } from "react";
import { Modal } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import { selectDeletedItem } from "@/redux/crud/selectors";
import { valueByString } from "@/utils/helpers";

const DeleteModal = React.memo(({ config }) => {
    let {
        entity,
        entityDisplayLabels,
        deleteMessage = "Do you want delete : ",
        modalTitle = "Remove Item",
    } = config;
    const dispatch = useDispatch();
    const { current, isLoading, isSuccess } = useSelector(selectDeletedItem);
    const { state, crudContextAction } = useCrudContext();
    const { isModalOpen } = state;
    const { modal } = crudContextAction;
    const [displayItem, setDisplayItem] = useState("");

    useEffect(() => {
        if (isSuccess) {
            modal.close();
            dispatch(crud.list(entity));
            dispatch(crud.resetAction(entity));
        }
        if (current?.isDeleted) deleteMessage = 'Do you want undelete: '
        if (current) {
            let labels = entityDisplayLabels
                .map((x) => valueByString(current, x))
                .join(" ");
            setDisplayItem(labels);

        }
    }, [isSuccess, current]);

    const handleOk = () => {
        let id = current._id;
        if (entity === 'post') id += `?user_id=${current.user_id._id}&isDeleted=${!current.isDeleted}`
        else id += `?isDeleted=${!current.isDeleted}`
        dispatch(crud.delete(entity, id, data => {
            if (data.success) modal.close()
        }));
    };
    const handleCancel = () => {
        if (!isLoading) modal.close();
    };
    return (
        <Modal
            title={modalTitle}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={isLoading}
        >
            <p>
                {deleteMessage}
                {displayItem}
            </p>
        </Modal>
    );
})
export default DeleteModal
