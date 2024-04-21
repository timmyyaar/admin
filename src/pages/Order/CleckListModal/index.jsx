import Plain from "./Plain";
import Complex from "./Complex";

import "./style.scss";

function CheckListModal({
  order,
  onClose,
  t,
  isPlain,
  onChangeOrderStatus,
  isFinished,
}) {
  const checkList = JSON.parse(order.check_list);

  return isPlain ? (
    <Plain
      onClose={onClose}
      t={t}
      checkList={checkList}
      isFinished={isFinished}
    />
  ) : (
    <Complex
      onClose={onClose}
      t={t}
      checkList={checkList}
      order={order}
      onChangeOrderStatus={onChangeOrderStatus}
    />
  );
}

export default CheckListModal;
