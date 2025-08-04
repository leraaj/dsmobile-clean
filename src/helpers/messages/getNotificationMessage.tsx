interface NotificationMessageParams {
  phase: string | number | any;
  applicationStatus: string | number | any;
  appointmentStatus?: string | number | any;
  complete: string | number | any;
  jobTitle: string;
  meetingLink: string | number | any;
  meetingTime: string | number | any;
  initialRemarks?: string | number | any;
  finalRemarks?: string | number | any;
  hiringRemarks?: string | number | any;
}
interface NotificationMessageResult {
  message: string | any;
  meetingLink?: string;
  meetingTime?: string;
  initialRemarks?: string;
  finalRemarks?: string | number | any;
  hiringRemarks?: string | number | any;
}

export function getNotificationMessage(
  {
    phase,
    applicationStatus,
    appointmentStatus,
    complete,
    jobTitle,
    meetingLink,
    meetingTime,
    initialRemarks,
    finalRemarks,
    hiringRemarks,
  }: NotificationMessageParams,
  type: "summary" | "details" = "summary"
): NotificationMessageResult {
  // PHASE 1
  if (phase === 1) {
    // Applicant sent an application: checked
    if (applicationStatus === 1 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>You've sent an application</>
          ) : (
            <>You've already sent an application for the role of {jobTitle}</>
          ),
      };
    }
    // Applicant accepted by client: checked
    if (applicationStatus === 2 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Application accepted</>
          ) : (
            <>
              Your request has been accepted, please wait for an appointment for
              the role of {jobTitle}
            </>
          ),
      };
    }
    // Client sent Initial Interview details: checked
    if (appointmentStatus === 1 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Invitation for Initial Interview</>
          ) : (
            <>Are you available this {meetingTime} ?</>
          ),
        meetingLink,
        meetingTime,
        initialRemarks,
      };
    } //Waiting/Undergoing for initial interview: checked
    if (appointmentStatus === 2 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Invitation for Initial Interview</>
          ) : (
            <>Kindly prepare for your initial interview</>
          ),
        meetingLink,
        meetingTime,
      };
    }
    // Rejected
    if (appointmentStatus === -1) {
      return {
        message:
          type === "summary" ? (
            <>Initial interview failed</>
          ) : (
            <>Initial interview failed</>
          ),
        meetingLink,
        meetingTime,
      };
    }
  }
  if (phase === 2) {
    // Client sent the Final interview: checked
    if (appointmentStatus === 1 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Invitation for Final Interview</>
          ) : (
            <>Final interview details:</>
          ),
        meetingLink,
        meetingTime,
        initialRemarks,
      };
    }
    // Applicant accepted the Final interview: checked
    if (appointmentStatus === 2 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Invitation for Final Interview</>
          ) : (
            <>Kindly prepare for your final interview</>
          ),
        meetingLink,
        meetingTime,
        initialRemarks,
      };
    }
  }
  if (phase === 3) {
    if (appointmentStatus === 1 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Invitation for Client Interview</>
          ) : (
            <>Kindly prepare for your client interview</>
          ),
        meetingLink,
        meetingTime,
        initialRemarks,
        finalRemarks,
      };
    }
    if (appointmentStatus === 2 && complete === 0) {
      return {
        message:
          type === "summary" ? (
            <>Invitation for Team Briefing</>
          ) : (
            <>
              Kindly prepare for your team briefing
              <br />
              {`${phase} ${appointmentStatus} ${complete}`}
            </>
          ),
        meetingLink,
        meetingTime,
        initialRemarks,
        finalRemarks,
      };
    }
    if (appointmentStatus === 2 && complete === 1) {
      return {
        message:
          type === "summary" ? (
            <>Congratulations! you passed the hiring process</>
          ) : (
            <>
              Please wait while we assigned you for a job on our website
              platform
              <br />
              {`${phase} ${appointmentStatus} ${complete}`}
            </>
          ),
        initialRemarks,
        finalRemarks,
        hiringRemarks,
      };
    }
  }

  return {
    message: (
      <>
        No specific message for this status. <strong>{jobTitle}</strong>
      </>
    ),
  };
}
