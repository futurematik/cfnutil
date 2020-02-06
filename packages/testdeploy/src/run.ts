export interface Main {
  (args: string[], self: string): PromiseLike<number | void>;
}

export function run(main: Main): void {
  process.on('beforeExit', () => {
    // if we get here, we didn't manage to get all the way back to the final
    // continuation below, so it's probably an error.
    console.error('ERROR: ran out of async continuations!');
    process.exit(99);
  });

  process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION:', err);
    process.exit(1);
  });

  main(process.argv.slice(2), process.argv[1]).then(
    result => {
      // assuming everything behaved nicely, we will always get here after main
      // completes
      process.exit(result || 0);
    },
    e => {
      console.error(e);
      process.exit(1);
    },
  );
}
