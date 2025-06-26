const ViewTemplate = ({ data }) => {
  return (
    <>
      <div className="d-flex align-items-baseline gap-3">
        <h4>Subject : </h4> <span>{data?.subject}</span>
      </div>
      <h4>Body :</h4>
      <div dangerouslySetInnerHTML={{ __html: data?.trigger_message_body }} />
    </>
  );
};

export default ViewTemplate;
