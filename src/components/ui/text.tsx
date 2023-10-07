interface Props extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'paragraph' | 'note' | 'inlineCode';
}

export function Text({ variant = 'paragraph', ...props }: Props) {
  const node: Record<typeof variant, React.ReactNode> = {
    paragraph: <Paragprah {...props} />,
    note: <Note {...props} />,
    inlineCode: <InlineCode {...props} />,
  };
  return node[variant];
}

function Paragprah(props: Props) {
  return (
    <p className='leading-7 [&:not(:first-child)]:mt-6'>{props.children}</p>
  );
}

function Note(props: Props) {
  return (
    <blockquote className='mt-6 border-l-2 pl-6'>{props.children}</blockquote>
  );
}

function InlineCode(props: Props) {
  return (
    <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
      {props.children}
    </code>
  );
}
