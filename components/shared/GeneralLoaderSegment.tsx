import * as React from 'react';
//
import { Dimmer, Icon, Loader, Message, MessageList, Segment } from "semantic-ui-react";

interface IGeneralLoaderSegmentProps {
  loading: boolean;
  initialMessage?: string;
  completionMessage?: string;
  errorMessages?: string[] | null;
  dismissComponent?():void;

}

export const GeneralLoaderSegment: React.FunctionComponent<IGeneralLoaderSegmentProps> = ({ loading, initialMessage, completionMessage, errorMessages, dismissComponent }) => {
  
  if (loading) {
    return (
      <Message icon positive onDismiss={ dismissComponent } data-test-id="gen-loader-loading-msg">
        <Icon name='circle notched' loading />
        <Message.Content>
          { initialMessage || "Processing Request" }
        </Message.Content>
      </Message>
    );
  } else if (errorMessages) {
    return (
      <Message icon error onDismiss={ dismissComponent } data-test-id="gen-loader-error-msg"> 
        <Icon name="warning circle" />
        <Message.Content>
          <Message.Header>{ completionMessage || "Error" }</Message.Header>
          <Message.List>
            {
              errorMessages.map(msg => <Message.Item key={ msg }>{ msg }</Message.Item>)
            }
          </Message.List>
        </Message.Content>
      </Message>
    );
  } else {
    return (
      <Message icon positive onDismiss={ dismissComponent } data-test-id="gen-loader-completion-msg">
        <Icon name="exclamation circle" color="blue" size="big"  />
        <Message.Content>
          <Message.Header>Done!</Message.Header>
          { completionMessage || "Request finished" }
        </Message.Content>
      </Message>
    )
  }
};
