export default function FieldInfo(props) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-baseball-green-900 dark:text-baseball-green-300 mb-3">
          Field History
        </h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          There are two fields at Ygnacio Valley Elementary School. Field #1 is
          closest to the school and is named{" "}
          <a
            href="/larry-byrne"
            className="text-baseball-sky-600 hover:text-baseball-sky-700 transition-colors underline"
          >
            Larry Byrne Veterans Field
          </a>
          . Field #2 is furthest from the school and is named Jones Field.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-baseball-green-900 dark:text-baseball-green-300 mb-4">
          Scoreboards
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Field #1 - AA
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>
                There is a power pole at the end of the first base line. Locate the
                power pole and flip the breaker that is labeled scoreboard.
              </li>
              <li>
                There is an extension cord and scoreboard controller in the first
                base dugout. There is a power outlet in the green box attached to
                the bathrooms. Run the extension cord from the power outlet to the
                stands on the third base side of the field.
              </li>
              <li>
                Once plugged in, it will send a command to boot up the scoreboard.
              </li>
              <li>
                The scoreboard will boot up and display the prior settings if not
                cleared. To create a new game state, do the following:
                <ol className="list-decimal list-inside ml-6 mt-2 space-y-1">
                  <li>
                    Press the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">New Game</code> button.
                  </li>
                  <li>
                    Press <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">1</code> to reset the game
                  </li>
                  <li>
                    Press <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Enter</code> to send the reset
                  </li>
                </ol>
              </li>
              <li>
                During the game, use the Ball +1, Strike +1, and Out +1 to cycle the
                counts.
              </li>
              <li>The scores and pitch counts can be updated in the same way.</li>
              <li>
                If you need to update the pitch count or the score, you can manually
                override:
                <ol className="list-decimal list-inside ml-6 mt-2 space-y-1">
                  <li>
                    Press the{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Set Guest Score/Set Home Score/Set Pitch Counts</code>{" "}
                    button.
                  </li>
                  <li>Enter the score using the keypad.</li>
                  <li>
                    Press <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Enter</code> to send the score.
                  </li>
                  <li>
                    For pitch counts, it will have the left and right pitch counts.
                    You press enter to cycle through them.
                  </li>
                </ol>
              </li>
              <li>
                If you need to download the manual, you can find it{" "}
                <a
                  href="https://www.electro-mech.com/wp-content/uploads/manuals/CXConsoleMPLinescore4DClock402B.pdf"
                  className="text-baseball-sky-600 hover:text-baseball-sky-700 transition-colors underline"
                >
                  here
                </a>
                .
              </li>
              <li>
                At the end of the game, put away the scoreboard controller,
                extension cord, and shut off the power at the power pole.
              </li>
            </ol>
          </div>

          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
              Field #2 - AAA
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed">
              <li>The scoreboard controller should be in the announcer booth.</li>
              <li>
                Try turning on the scoreboard by pressing the brightness button. If
                it comes on immediately, you can proceed. If it doesn&apos;t come
                on, there is a switch on the inside of the pump shed door. This
                switch should be up for the scoreboard to turn on.
              </li>
              <li>
                If there is a lingering score, you can clear the game state by
                following the reset settings.
                <ol className="list-decimal list-inside ml-6 mt-2 space-y-1">
                  <li>
                    Press the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Set</code>
                  </li>
                  <li>
                    Press <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">R</code> - <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">E</code> - <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">S</code> -{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">E</code> - <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">T</code>
                  </li>
                  <li>
                    Press <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Enter</code> to send the reset
                  </li>
                </ol>
              </li>
              <li>
                During the game, use the Ball +1, Strike +1, and Out +1 to cycle the
                counts.
              </li>
              <li>
                The score can be updated using the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Score +1</code> button.
              </li>
              <li>
                If you need to manually override the score, you can do so by
                pressing <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Set</code> and then <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Score +1</code> button
                followed by the score. For example, if the score home team score is
                6, but you accidentally have it as 7, press <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Set</code>,{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Home - Score +1</code>, enter the score, and then press{" "}
                <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Enter</code>.
              </li>
              <li>
                At the end of the game, you can press the <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-900 dark:text-gray-100">Brightness</code> to
                turn the scoreboard off.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
