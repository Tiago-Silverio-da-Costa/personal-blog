import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
}

export default function EmailTemplate({
  firstName,
}: {
  firstName: string
}) {

  return (

    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  )
}


