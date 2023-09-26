import { Modal } from "antd";
import { useState, useEffect } from "react";
import { interfaceClass } from "./GroupClasses";

function ClassDetails({
  handleCloseClassDetail,
  classes,
  selectedClassId,
}: {
  handleCloseClassDetail: () => void;
  classes: interfaceClass[];
  selectedClassId: string | null;
}) {
  const [open, setOpen] = useState(true); //modal
  const [confirmLoading, setConfirmLoading] = useState(false); //modal
  const [selectedClass, setSelectedClass] = useState<interfaceClass | null>();

  //Find the selected class in classes array:
  const findClass = classes.find(
    (classItem) => classItem.classId === selectedClassId
  );

  useEffect(() => {
    setSelectedClass(findClass);
  }, [findClass]);

  // ---------------------------modal--------------------------------
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = (): void => {
    handleCloseClassDetail();
  };
  // ---------------------------render data--------------------------------

  return (
    <div>
      <Modal
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
        footer={null}
      >
        <div className="classDetail w-full pt-[2rem] pb-[3rem] px-[3rem]">
          <div className="flex justify-center text-4xl mb-[1.5rem] font-semibold">
            {selectedClass?.className}
          </div>
          <div className="flex justify-around gap-[2.5rem]">
            <div>
              <img
                className="ClassImage w-[120rem] h-[20rem] object-cover rounded-lg"
                src={selectedClass?.classImage}
                alt={selectedClass?.className}
              />
            </div>
            <div>
              <div className="text-base text-justify">
                {selectedClass?.classInfo}
              </div>
              <div className="mt-[.2rem] text-lg font-semibold">
                Time: {selectedClass?.classTime}
              </div>
              <div className="text-lg font-semibold">
                Slots left: {selectedClass?.slots}
              </div>
              <div className="text-lg font-semibold">
                Price: ${selectedClass?.price}/month
              </div>
              <div className="flex justify-left my-[1.5rem]">
                <img
                  className="CoachImage w-[5rem] h-[5rem] rounded-full object-cover"
                  src={selectedClass?.coachImage}
                  alt={selectedClass?.coachName}
                />
                <div className="ml-[1.3rem] flex flex-col justify-center">
                  <div className="text-2xl font-semibold">
                    {selectedClass?.coachName}
                  </div>
                  <div>{selectedClass?.major}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ClassDetails;
